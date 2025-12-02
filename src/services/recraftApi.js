/**
 * Recraft AI API integration for transparent element generation
 */

const RECRAFT_BASE_URL = 'https://external.api.recraft.ai/v1/images/generations';

export async function generateElementWithRecraft(apiKey, elementDescription, colorPalette, aspectRatio = '16:9') {
  // Recraft supports these aspect ratios
  const aspectRatioMap = {
    '1:1': '1:1',
    '16:9': '16:9',
    '9:16': '9:16',
    '4:3': '4:3',
    '3:4': '3:4',
    '21:9': '21:9',
    '2:3': '2:3',
    '3:2': '3:2',
    '4:5': '4:5',
    '5:4': '5:4'
  };

  const recraftAspectRatio = aspectRatioMap[aspectRatio] || '16:9';

  const colorPaletteText = colorPalette && colorPalette.length > 0
    ? ` Color palette: ${colorPalette.join(', ')}.`
    : '';

  try {
    const response = await fetch(RECRAFT_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: `${elementDescription}. Completely transparent background, isolated element, no visible background, PNG with alpha channel.${colorPaletteText}`,
        style: 'realistic_image',
        size: recraftAspectRatio,
        transparency: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Recraft generation failed');
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image returned from Recraft');
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
    console.error('Recraft element generation failed:', error);
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
