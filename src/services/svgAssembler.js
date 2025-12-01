import { calculateAbsolutePosition } from './imageAnalyzer.js';

/**
 * Assemble SVG from regenerated elements
 */
export function assembleSvg(elements, width, height) {
  const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}"
     height="${height}"
     viewBox="0 0 ${width} ${height}">`;

  const svgFooter = '</svg>';

  // Generate image elements
  const imageElements = elements.map((element) => {
    const pos = calculateAbsolutePosition(element.boundingBox, width, height);

    // Sanitize ID for use in SVG
    const sanitizedId = element.id.replace(/[^a-zA-Z0-9-_]/g, '-');

    return `  <image id="layer-${element.zIndex}-${sanitizedId}"
         xlink:href="data:${element.mimeType};base64,${element.imageData}"
         x="${pos.x}"
         y="${pos.y}"
         width="${pos.width}"
         height="${pos.height}"/>`;
  }).join('\n');

  return `${svgHeader}\n${imageElements}\n${svgFooter}`;
}

/**
 * Convert SVG string to data URL
 */
export function svgToDataUrl(svgString) {
  const base64 = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Render SVG to PNG canvas
 */
export function renderSvgToPng(svgString, width, height) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = svgToDataUrl(svgString);
  });
}

/**
 * Create preview image from SVG
 */
export async function createSvgPreview(svgString, width, height) {
  try {
    const pngBase64 = await renderSvgToPng(svgString, width, height);
    return `data:image/png;base64,${pngBase64}`;
  } catch (error) {
    console.error('Failed to create SVG preview:', error);
    // Fallback to SVG data URL if PNG rendering fails
    return svgToDataUrl(svgString);
  }
}
