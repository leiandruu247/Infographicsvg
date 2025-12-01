import JSZip from 'jszip';
import { base64ToBlob } from '../utils/base64.js';

/**
 * Download SVG file
 */
export function downloadSvg(svgString, filename = 'infographic.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  downloadBlob(blob, filename);
}

/**
 * Download PNG file from base64
 */
export function downloadPng(base64Data, filename = 'infographic.png') {
  const blob = base64ToBlob(base64Data, 'image/png');
  downloadBlob(blob, filename);
}

/**
 * Download blob as file
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Create and download ZIP bundle with SVG and element PNGs
 */
export async function downloadZipBundle(svgString, elements, filename = 'infographic-bundle.zip') {
  try {
    const zip = new JSZip();

    // Add SVG file
    zip.file('infographic.svg', svgString);

    // Create elements folder and add PNG files
    const elementsFolder = zip.folder('elements');

    elements.forEach((element, index) => {
      const elementFilename = `${String(index + 1).padStart(2, '0')}-${sanitizeFilename(element.id)}.png`;
      const blob = base64ToBlob(element.imageData, element.mimeType);
      elementsFolder.file(elementFilename, blob);
    });

    // Generate ZIP and download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, filename);

    return true;
  } catch (error) {
    console.error('Failed to create ZIP bundle:', error);
    throw error;
  }
}

/**
 * Sanitize filename by removing invalid characters
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

/**
 * Export all formats at once
 */
export async function exportAll(svgString, pngBase64, elements) {
  try {
    // Download SVG
    downloadSvg(svgString, 'infographic.svg');

    // Small delay to prevent browser blocking multiple downloads
    await new Promise(resolve => setTimeout(resolve, 100));

    // Download PNG
    downloadPng(pngBase64, 'infographic.png');

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Download ZIP
    await downloadZipBundle(svgString, elements, 'infographic-bundle.zip');

    return true;
  } catch (error) {
    console.error('Failed to export all files:', error);
    throw error;
  }
}
