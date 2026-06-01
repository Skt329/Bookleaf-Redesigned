import { ZodSchema } from 'zod';

/**
 * Configuration options for AI text/JSON generation requests.
 */
export interface AIOptions {
  /** Model deployment name override */
  model?: string;
  /** Maximum tokens in the completion */
  maxTokens?: number;
  /** Sampling temperature (0-2). Lower = more deterministic */
  temperature?: number;
  /** System-level instruction prepended to the conversation */
  systemPrompt?: string;
}

/**
 * Standardised response from an AI generation call.
 */
export interface AIResponse {
  /** The generated text content */
  text: string;
  /** Token usage breakdown (when available from the provider) */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Provider-agnostic interface for AI text and structured-data generation.
 *
 * Implementations must handle authentication, retries, and error mapping
 * internally so callers get a clean, consistent API regardless of the
 * underlying service (Azure OpenAI, Anthropic, local models, etc.).
 */
export interface AIProvider {
  /**
   * Generate free-form text from a prompt.
   *
   * @param prompt - The user-facing prompt / instruction.
   * @param options - Optional generation parameters.
   * @returns The generated text together with token-usage metadata.
   */
  generateText(prompt: string, options?: AIOptions): Promise<AIResponse>;

  /**
   * Generate a JSON object that conforms to the supplied Zod schema.
   *
   * Implementations should request JSON mode from the underlying model,
   * parse the result with the schema, and throw a typed error on
   * validation failure.
   *
   * @param prompt  - The user-facing prompt describing the desired output.
   * @param schema  - A Zod schema that the returned object must satisfy.
   * @param options - Optional generation parameters.
   * @returns The parsed, type-safe object.
   */
  generateJSON<T>(prompt: string, schema: ZodSchema<T>, options?: AIOptions): Promise<T>;

  /**
   * Generate text from a prompt combined with an image input (vision).
   *
   * @param prompt      - The user-facing prompt / instruction.
   * @param imageBase64 - Base64-encoded image data.
   * @param mimeType    - MIME type of the image (e.g. `image/png`).
   * @param options     - Optional generation parameters.
   * @returns The generated text together with token-usage metadata.
   */
  generateTextWithImage?(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    options?: AIOptions,
  ): Promise<AIResponse>;
}
