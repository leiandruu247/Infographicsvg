const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';
const ANALYSIS_MODEL = 'gemini-3-pro-preview';

/**
 * Validate API key by making a simple test request
 */
export async function validateApiKey(apiKey) {
  try {
    const url = `${BASE_URL}/${ANALYSIS_MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hi'
          }]
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Invalid API key');
    }

    return { valid: true };
  } catch (error) {
    console.error('API key validation failed:', error);
    return { valid: false, error: error.message };
  }
}

/**
 * Generate complete infographic image
 */
export async function generateInfographic(apiKey, prompt, width = 1376, height = 768) {
  const aspectRatio = width / height;
  const url = `${BASE_URL}/${IMAGE_MODEL}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a professional infographic with the following requirements:\n\n${prompt}\n\nThe infographic should be well-designed, visually appealing, and suitable for professional use.`
          }]
        }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
          imageConfig: {
            aspectRatio: aspectRatio.toString()
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Image generation failed');
    }

    const data = await response.json();

    // Extract image from response
    const candidate = data.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(part => part.inlineData?.mimeType?.startsWith('image/'));

    if (!imagePart) {
      throw new Error('No image returned in response');
    }

    return {
      imageData: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
      width,
      height
    };
  } catch (error) {
    console.error('Infographic generation failed:', error);
    throw error;
  }
}

/**
 * Analyze infographic to identify individual elements
 */
export async function analyzeInfographic(apiKey, imageData) {
  const url = `${BASE_URL}/${ANALYSIS_MODEL}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this infographic image and identify all distinct visual elements.

For each element, provide:
1. A unique identifier (e.g., "background", "title", "icon-1", "chart", etc.)
2. A detailed description of the element
3. The bounding box as percentages (x%, y%, width%, height%) where 0,0 is top-left
4. Z-index/layer order (0 = background, higher numbers = foreground)
5. Dominant colors in the element (as hex codes)

Also extract the overall color palette used in the infographic (5-10 main colors as hex codes).

Return ONLY valid JSON (no markdown formatting) in this exact structure:
{
  "elements": [
    {
      "id": "background",
      "description": "White background layer",
      "boundingBox": { "x": 0, "y": 0, "width": 100, "height": 100 },
      "zIndex": 0,
      "colors": ["#FFFFFF"]
    }
  ],
  "colorPalette": ["#FFFFFF", "#000000", "#FF5733"]
}`
            },
            {
              inlineData: {
                mimeType: 'image/png',
                data: imageData
              }
            }
          ]
        }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Analysis failed');
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No analysis result returned');
    }

    // Parse JSON response (removing any markdown code blocks if present)
    let jsonText = textContent.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const analysisResult = JSON.parse(jsonText);

    if (!analysisResult.elements || !Array.isArray(analysisResult.elements)) {
      throw new Error('Invalid analysis result format');
    }

    return analysisResult;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}

/**
 * Generate a single element with transparent background
 */
export async function generateElement(apiKey, elementDescription, colorPalette, width = 1376, height = 768) {
  const url = `${BASE_URL}/${IMAGE_MODEL}:generateContent?key=${apiKey}`;
  const aspectRatio = width / height;

  const colorPaletteText = colorPalette && colorPalette.length > 0
    ? `\n\nUse ONLY these colors: ${colorPalette.join(', ')}`
    : '';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate this element: ${elementDescription}

CRITICAL REQUIREMENTS:
- Completely transparent background (PNG with alpha channel)
- NO background, isolated element only
- Match the exact style and design of the original infographic
- High quality, professional appearance${colorPaletteText}`
          }]
        }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: {
            aspectRatio: aspectRatio.toString()
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Element generation failed');
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(part => part.inlineData?.mimeType?.startsWith('image/'));

    if (!imagePart) {
      throw new Error('No image returned in response');
    }

    return {
      imageData: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType
    };
  } catch (error) {
    console.error('Element generation failed:', error);
    throw error;
  }
}

/**
 * Retry wrapper for API calls
 */
export async function retryApiCall(apiCall, maxRetries = 2) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        console.log(`Attempt ${attempt + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}
