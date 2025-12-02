/**
 * Ideogram API integration for transparent element generation
 */

const IDEOGRAM_BASE_URL = 'https://api.ideogram.ai/generate';

export async function generateElementWithIdeogram(apiKey, elementDescription, colorPalette, aspectRatio = '16:9') {
  // Ideogram aspect ratio mapping
  const aspectRatioMap = {
    '1:1': 'ASPECT_1_1',
    '16:9': 'ASPECT_16_9',
    '9:16': 'ASPECT_9_16',
    '4:3': 'ASPECT_4_3',
    '3:4': 'ASPECT_3_4',
    '3:2': 'ASPECT_3_2',
    '2:3': 'ASPECT_2_3',
    '5:4': 'ASPECT_5_4',
    '4:5': 'ASPECT_4_5',
    '21:9': 'ASPECT_16_9' // Fallback to 16:9
  };

  const ideogramAspectRatio = aspectRatioMap[aspectRatio] || 'ASPECT_16_9';

  const colorPaletteText = colorPalette && colorPalette.length > 0
    ? ` Using color palette: ${colorPalette.join(', ')}.`
    : '';

  try {
    const response = await fetch(IDEOGRAM_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey
      },
      body: JSON.stringify({
        image_request: {
          prompt: `${elementDescription}. Transparent background, isolated element only, no visible background, PNG format with alpha transparency.${colorPaletteText}`,
          aspect_ratio: ideogramAspectRatio,
          model: 'V_2',
          magic_prompt_option: 'OFF',
          style_type: 'REALISTIC'
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Ideogram generation failed');
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image returned from Ideogram');
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
    console.error('Ideogram element generation failed:', error);
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
