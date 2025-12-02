const GEMINI_API_KEY = 'gemini_api_key';
const ELEMENT_PROVIDER_KEY = 'element_provider';
const ELEMENT_API_KEYS = 'element_api_keys';

/**
 * Save Gemini API key (for infographic generation and analysis)
 */
export function saveApiKey(apiKey) {
  try {
    localStorage.setItem(GEMINI_API_KEY, apiKey);
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    return false;
  }
}

/**
 * Get Gemini API key
 */
export function getApiKey() {
  try {
    return localStorage.getItem(GEMINI_API_KEY);
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
}

/**
 * Remove Gemini API key
 */
export function removeApiKey() {
  try {
    localStorage.removeItem(GEMINI_API_KEY);
    return true;
  } catch (error) {
    console.error('Error removing API key:', error);
    return false;
  }
}

/**
 * Check if Gemini API key exists
 */
export function hasApiKey() {
  return !!getApiKey();
}

/**
 * Save element generation provider API key
 */
export function saveElementApiKey(provider, apiKey) {
  try {
    const keys = getElementApiKeys();
    keys[provider] = apiKey;
    localStorage.setItem(ELEMENT_API_KEYS, JSON.stringify(keys));
    return true;
  } catch (error) {
    console.error('Error saving element API key:', error);
    return false;
  }
}

/**
 * Get element generation provider API key
 */
export function getElementApiKey(provider) {
  try {
    const keys = getElementApiKeys();
    return keys[provider] || null;
  } catch (error) {
    console.error('Error getting element API key:', error);
    return null;
  }
}

/**
 * Get all element API keys
 */
export function getElementApiKeys() {
  try {
    const keysJson = localStorage.getItem(ELEMENT_API_KEYS);
    return keysJson ? JSON.parse(keysJson) : {};
  } catch (error) {
    console.error('Error getting element API keys:', error);
    return {};
  }
}

/**
 * Save selected element provider
 */
export function saveElementProvider(provider) {
  try {
    localStorage.setItem(ELEMENT_PROVIDER_KEY, provider);
    return true;
  } catch (error) {
    console.error('Error saving element provider:', error);
    return false;
  }
}

/**
 * Get selected element provider
 */
export function getElementProvider() {
  try {
    return localStorage.getItem(ELEMENT_PROVIDER_KEY) || 'gemini';
  } catch (error) {
    console.error('Error getting element provider:', error);
    return 'gemini';
  }
}

/**
 * Check if element provider has API key configured
 */
export function hasElementApiKey(provider) {
  return !!getElementApiKey(provider);
}
