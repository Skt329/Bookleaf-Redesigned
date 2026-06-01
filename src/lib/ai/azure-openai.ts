import { ZodSchema } from 'zod';

import { sleep } from '@/lib/utils';

import type { AIOptions, AIProvider, AIResponse } from './provider';

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[AzureOpenAI] Missing required environment variable: ${name}`);
  }
  return value;
}

// ---------------------------------------------------------------------------
// Types for the Azure OpenAI REST API response shape
// ---------------------------------------------------------------------------

interface AzureChatChoice {
  message: { role: string; content: string | null };
  finish_reason: string;
}

interface AzureChatResponse {
  id: string;
  choices: AzureChatChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;
const DEFAULT_API_VERSION = '2024-12-01-preview';
const DEFAULT_MAX_TOKENS = 2048;
const DEFAULT_TEMPERATURE = 0.7;

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * Azure OpenAI provider that calls the REST API directly (no SDK dependency).
 *
 * Required environment variables:
 * - `AZURE_OPENAI_ENDPOINT`         – e.g. https://my-resource.openai.azure.com
 * - `AZURE_OPENAI_API_KEY`          – API key for the resource
 * - `AZURE_OPENAI_DEPLOYMENT_NAME`  – deployment / model name
 * - `AZURE_OPENAI_API_VERSION`      – optional, defaults to 2024-12-01-preview
 */
export class AzureOpenAIProvider implements AIProvider {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly deploymentName: string;
  private readonly apiVersion: string;

  constructor() {
    this.endpoint = requireEnv('AZURE_OPENAI_ENDPOINT').replace(/\/+$/, '');
    this.apiKey = requireEnv('AZURE_OPENAI_API_KEY');
    this.deploymentName = requireEnv('AZURE_OPENAI_DEPLOYMENT_NAME');
    this.apiVersion =
      process.env.AZURE_OPENAI_API_VERSION ?? DEFAULT_API_VERSION;
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /** Generate free-form text from a prompt. */
  async generateText(prompt: string, options: AIOptions = {}): Promise<AIResponse> {
    const body = this.buildRequestBody(prompt, options);
    const data = await this.callWithRetries<AzureChatResponse>(body);

    const text = data.choices[0]?.message?.content ?? '';
    return {
      text,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  /** Generate a JSON object validated against a Zod schema. */
  async generateJSON<T>(
    prompt: string,
    schema: ZodSchema<T>,
    options: AIOptions = {},
  ): Promise<T> {
    const systemPrompt = [
      options.systemPrompt,
      'You MUST respond with valid JSON only. No markdown, no explanation, no code fences.',
    ]
      .filter(Boolean)
      .join('\n\n');

    const body = this.buildRequestBody(prompt, {
      ...options,
      systemPrompt,
    });

    // Enable JSON mode
    body.response_format = { type: 'json_object' };

    const data = await this.callWithRetries<AzureChatResponse>(body);
    const raw = data.choices[0]?.message?.content ?? '{}';

    try {
      const parsed: unknown = JSON.parse(raw);
      return schema.parse(parsed);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown parse/validation error';
      throw new Error(
        `[AzureOpenAI] Failed to parse/validate JSON response: ${message}\nRaw: ${raw.slice(0, 500)}`,
      );
    }
  }

  // -----------------------------------------------------------------------
  // Internals
  // -----------------------------------------------------------------------

  /** Build the chat completions request body. */
  private buildRequestBody(
    prompt: string,
    options: AIOptions,
  ): Record<string, unknown> {
    const messages: Array<{ role: string; content: string }> = [];

    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    return {
      messages,
      max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: options.temperature ?? DEFAULT_TEMPERATURE,
    };
  }

  /** Build the full deployment URL for chat completions. */
  private buildUrl(model?: string): string {
    const deployment = model ?? this.deploymentName;
    return `${this.endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${this.apiVersion}`;
  }

  /**
   * Execute the HTTP request with exponential-backoff retries.
   *
   * Retries on:
   * - Network errors
   * - 429 (rate limit) and 5xx (server errors)
   */
  private async callWithRetries<T>(
    body: Record<string, unknown>,
    model?: string,
  ): Promise<T> {
    const url = this.buildUrl(model);
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          const isRetryable = response.status === 429 || response.status >= 500;

          if (isRetryable && attempt < MAX_RETRIES) {
            const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
            console.warn(
              `[AzureOpenAI] Attempt ${attempt}/${MAX_RETRIES} failed (${response.status}). Retrying in ${delay}ms…`,
            );
            await sleep(delay);
            continue;
          }

          throw new Error(
            `[AzureOpenAI] API error ${response.status}: ${errorBody.slice(0, 500)}`,
          );
        }

        return (await response.json()) as T;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
          console.warn(
            `[AzureOpenAI] Attempt ${attempt}/${MAX_RETRIES} threw: ${lastError.message}. Retrying in ${delay}ms…`,
          );
          await sleep(delay);
        }
      }
    }

    throw lastError ?? new Error('[AzureOpenAI] All retry attempts exhausted');
  }
}
