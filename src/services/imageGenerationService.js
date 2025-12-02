/**
 * Unified image generation service that supports multiple providers
 */

import { generateElement as generateWithGemini } from './geminiApi.js';
import { generateElementWithFirefly } from './fireflyApi.js';
import { generateElementWithRecraft } from './recraftApi.js';
import { generateElementWithIdeogram } from './ideogramApi.js';
import { generateElementWithOpenAI } from './openaiApi.js';

export const IMAGE_PROVIDERS = {
  GEMINI: 'gemini',
  OPENAI: 'openai',
  FIREFLY: 'firefly',
  RECRAFT: 'recraft',
  IDEOGRAM: 'ideogram'
};

/**
 * Generate element using the specified provider
 */
export async function generateElementWithProvider(
  provider,
  apiKey,
  elementDescription,
  colorPalette,
  aspectRatio
) {
  switch (provider) {
    case IMAGE_PROVIDERS.OPENAI:
      return await generateElementWithOpenAI(apiKey, elementDescription, colorPalette, aspectRatio);

    case IMAGE_PROVIDERS.FIREFLY:
      return await generateElementWithFirefly(apiKey, elementDescription, colorPalette, aspectRatio);

    case IMAGE_PROVIDERS.RECRAFT:
      return await generateElementWithRecraft(apiKey, elementDescription, colorPalette, aspectRatio);

    case IMAGE_PROVIDERS.IDEOGRAM:
      return await generateElementWithIdeogram(apiKey, elementDescription, colorPalette, aspectRatio);

    case IMAGE_PROVIDERS.GEMINI:
    default:
      return await generateWithGemini(apiKey, elementDescription, colorPalette, aspectRatio);
  }
}

/**
 * Get provider display name
 */
export function getProviderName(provider) {
  const names = {
    [IMAGE_PROVIDERS.GEMINI]: 'Gemini (Google)',
    [IMAGE_PROVIDERS.OPENAI]: 'DALL-E 3 (OpenAI)',
    [IMAGE_PROVIDERS.FIREFLY]: 'Adobe Firefly',
    [IMAGE_PROVIDERS.RECRAFT]: 'Recraft AI',
    [IMAGE_PROVIDERS.IDEOGRAM]: 'Ideogram'
  };
  return names[provider] || provider;
}

/**
 * Get provider description
 */
export function getProviderDescription(provider) {
  const descriptions = {
    [IMAGE_PROVIDERS.GEMINI]: 'Good for general images, limited transparency support',
    [IMAGE_PROVIDERS.OPENAI]: 'DALL-E 3 HD quality, good transparency',
    [IMAGE_PROVIDERS.FIREFLY]: 'Excellent transparency, Adobe quality',
    [IMAGE_PROVIDERS.RECRAFT]: 'Built for transparent elements, fast generation',
    [IMAGE_PROVIDERS.IDEOGRAM]: 'High quality realistic images'
  };
  return descriptions[provider] || '';
}
