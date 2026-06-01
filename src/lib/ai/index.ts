/**
 * AI provider barrel export.
 *
 * Use `getAIProvider()` to obtain the configured provider instance.
 * The active provider is determined by the `AI_PROVIDER` env var
 * (default: `azure-openai`).
 *
 * @example
 * ```ts
 * import { getAIProvider } from '@/lib/ai';
 *
 * const ai = getAIProvider();
 * const { text } = await ai.generateText('Summarise this manuscript…');
 * ```
 */

export type { AIOptions, AIProvider, AIResponse } from './provider';
export { AzureOpenAIProvider } from './azure-openai';

import type { AIProvider } from './provider';
import { AzureOpenAIProvider } from './azure-openai';

/** Singleton cache so the provider is only instantiated once per process. */
let _instance: AIProvider | null = null;

/**
 * Return the configured AI provider.
 *
 * Reads `AI_PROVIDER` from `process.env` on first call and caches the
 * result for the lifetime of the process.
 *
 * Supported values:
 * - `azure-openai` (default) – Azure OpenAI GPT-4.1 Mini
 *
 * @throws {Error} If the requested provider is unknown.
 */
export function getAIProvider(): AIProvider {
  if (_instance) return _instance;

  const provider = process.env.AI_PROVIDER ?? 'azure-openai';

  switch (provider) {
    case 'azure-openai':
      _instance = new AzureOpenAIProvider();
      break;
    default:
      throw new Error(
        `[AI] Unknown provider "${provider}". Supported: azure-openai`,
      );
  }

  return _instance;
}
