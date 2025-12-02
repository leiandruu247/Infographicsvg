import { analyzeInfographic, generateElement, retryApiCall } from './geminiApi.js';

/**
 * Analyze infographic and regenerate all elements
 */
export async function analyzeAndRegenerateElements(
  apiKey,
  imageData,
  aspectRatio,
  onProgress
) {
  try {
    // Step 1: Analyze the infographic
    onProgress?.({ phase: 'analyzing', message: 'Analyzing infographic elements...' });

    const analysisResult = await retryApiCall(() =>
      analyzeInfographic(apiKey, imageData)
    );

    const { elements, colorPalette } = analysisResult;

    if (!elements || elements.length === 0) {
      throw new Error('No elements detected in the infographic');
    }

    // Step 2: Regenerate each element
    const regeneratedElements = [];

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      onProgress?.({
        phase: 'regenerating',
        message: `Regenerating element ${i + 1} of ${elements.length}...`,
        current: i + 1,
        total: elements.length
      });

      try {
        const elementImage = await retryApiCall(() =>
          generateElement(
            apiKey,
            element.description,
            colorPalette,
            aspectRatio
          )
        );

        regeneratedElements.push({
          id: element.id,
          description: element.description,
          boundingBox: element.boundingBox,
          zIndex: element.zIndex,
          imageData: elementImage.imageData,
          mimeType: elementImage.mimeType,
          colors: element.colors
        });
      } catch (error) {
        console.error(`Failed to regenerate element ${element.id}:`, error);
        // Continue with other elements even if one fails
        onProgress?.({
          phase: 'regenerating',
          message: `Warning: Failed to regenerate element ${element.id}`,
          current: i + 1,
          total: elements.length
        });
      }
    }

    if (regeneratedElements.length === 0) {
      throw new Error('Failed to regenerate any elements');
    }

    // Sort by z-index
    regeneratedElements.sort((a, b) => a.zIndex - b.zIndex);

    return {
      elements: regeneratedElements,
      colorPalette
    };
  } catch (error) {
    console.error('Element analysis and regeneration failed:', error);
    throw error;
  }
}

/**
 * Calculate absolute position from percentage bounding box
 */
export function calculateAbsolutePosition(boundingBox, canvasWidth, canvasHeight) {
  return {
    x: (boundingBox.x / 100) * canvasWidth,
    y: (boundingBox.y / 100) * canvasHeight,
    width: (boundingBox.width / 100) * canvasWidth,
    height: (boundingBox.height / 100) * canvasHeight
  };
}
