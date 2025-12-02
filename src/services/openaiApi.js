/**
 * OpenAI DALL-E 3 API integration for transparent element generation
 */

const OPENAI_BASE_URL = 'https://api.openai.com/v1/images/generations';

export async function generateElementWithOpenAI(apiKey, elementDescription, colorPalette, aspectRatio = '16:9') {
  // OpenAI DALL-E 3 size mapping
  const sizeMap = {
    '1:1': '1024x1024',
    '16:9': '1792x1024',
    '9:16': '1024x1792',
    '4:3': '1792x1024',    // Closest to 4:3
    '3:4': '1024x1792',    // Closest to 3:4
    '21:9': '1792x1024',   // Use landscape
    '2:3': '1024x1792',    // Use portrait
    '3:2': '1792x1024',    // Use landscape
    '4:5': '1024x1792',    // Use portrait
    '5:4': '1792x1024'     // Use landscape
  };

  const size = sizeMap[aspectRatio] || '1792x1024';

  const colorPaletteText = colorPalette && colorPalette.length > 0
    ? ` Color palette: ${colorPalette.join(', ')}.`
    : '';

  try {
    const response = await fetch(OPENAI_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `${elementDescription}. IMPORTANT: Generate this as an isolated element on a completely transparent background. No visible background, PNG format with full alpha transparency.${colorPaletteText}`,
        size: size,
        quality: 'hd',
        n: 1,
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI generation failed');
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image returned from OpenAI');
    }

    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const base64 = await blobToBase64(imageBlob);

    return {
      imageData: base64,
      mimeType: 'image/png'
    };
  } catch (error) {
    console.error('OpenAI element generation failed:', error);
    throw error;
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
