const API_KEY_STORAGE_KEY = 'gemini_api_key';

/**
 * Save API key to localStorage
 */
export function saveApiKey(apiKey) {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    return false;
  }
}

/**
 * Get API key from localStorage
 */
export function getApiKey() {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
}

/**
 * Remove API key from localStorage
 */
export function removeApiKey() {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error removing API key:', error);
    return false;
  }
}

/**
 * Check if API key exists
 */
export function hasApiKey() {
  return !!getApiKey();
}
