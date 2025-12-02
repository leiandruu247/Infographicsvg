/**
 * Adobe Firefly API integration for transparent element generation
 */

const FIREFLY_BASE_URL = 'https://firefly-api.adobe.io/v3/images/generate';

export async function generateElementWithFirefly(apiKey, elementDescription, colorPalette, aspectRatio = '16:9') {
  // Convert aspect ratio to Firefly dimensions
  const dimensionsMap = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1792, height: 1024 },
    '9:16': { width: 1024, height: 1792 },
    '4:3': { width: 1408, height: 1024 },
    '3:4': { width: 1024, height: 1408 },
    '21:9': { width: 2304, height: 1024 },
    '2:3': { width: 1024, height: 1536 },
    '3:2': { width: 1536, height: 1024 }
  };

  const { width, height } = dimensionsMap[aspectRatio] || { width: 1792, height: 1024 };

  const colorPaletteText = colorPalette && colorPalette.length > 0
    ? ` Use colors: ${colorPalette.join(', ')}.`
    : '';

  try {
    const response = await fetch(FIREFLY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        prompt: `${elementDescription}. Isolated element on transparent background, no background visible, PNG with alpha channel.${colorPaletteText}`,
        contentClass: 'art',
        size: {
          width,
          height
        },
        styles: {
          presets: ['transparent_background']
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Firefly generation failed');
    }

    const data = await response.json();
    const imageUrl = data.outputs?.[0]?.image?.url;

    if (!imageUrl) {
      throw new Error('No image returned from Firefly');
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
    console.error('Firefly element generation failed:', error);
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
