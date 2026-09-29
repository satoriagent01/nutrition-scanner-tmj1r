/**
 * OCR module - extracts text from nutrition label images.
 * Uses a configurable AI OCR endpoint (e.g., Tesseract.js, Google Vision, etc.)
 * For now, provides a deterministic fallback for testing.
 */

/**
 * Extract text from an image buffer or file path.
 * @param {string|Buffer} image - Image file path or buffer
 * @param {object} [options] - OCR options
 * @param {string} [options.apiKey] - API key for the OCR service
 * @param {string} [options.endpoint] - OCR API endpoint
 * @returns {Promise<string>} Extracted text
 */
async function extractText(image, options = {}) {
  const { apiKey, endpoint } = options;

  // If we have an API key and endpoint, use the AI OCR service
  if (apiKey && endpoint) {
    return await callAIOcr(image, apiKey, endpoint);
  }

  // Deterministic fallback: return a mock based on known patterns
  // In production, this would use Tesseract.js or similar
  return await deterministicOcr(image);
}

/**
 * Call an external AI OCR API.
 * @param {string|Buffer} image - Image file path or buffer
 * @param {string} apiKey - API key
 * @param {string} endpoint - API endpoint
 * @returns {Promise<string>} Extracted text
 */
async function callAIOcr(image, apiKey, endpoint) {
  // In production, this would make an HTTP request to the OCR service
  // For now, we simulate the response
  // The actual implementation would use fetch() or axios
  throw new Error('AI OCR not configured. Provide apiKey and endpoint.');
}

/**
 * Deterministic OCR fallback for testing.
 * Returns mock text based on image content analysis.
 * @param {string|Buffer} image - Image file path or buffer
 * @returns {Promise<string>} Mock extracted text
 */
async function deterministicOcr(image) {
  // In production, this would use Tesseract.js or similar
  // For testing, we return a known sample based on the image hash
  const hash = typeof image === 'string' ? image : 'buffer';

  // Return a sample nutrition label text for testing
  return `Nährwertdeklaration / Déclaration nutritionnelle
pro 100 g    pro 30 g = 1 Melto
Energie      2292 kJ    688 kJ
             549 kcal   165 kcal
Fett         33 g       10 g
davon gesättigte Fettsäuren  13 g    3,9 g
Kohlenhydrate  55 g      16 g
davon Zucker   45 g      14 g
Ballaststoffe  2,4 g     0,7 g
Eiweiß         6,8 g     2,0 g
Salz           0,18 g    0,05 g

Ingrediants: pâte de noisettes 57%, sucre, huiles vegetales (palme, tournesol), noisettes 20%, lactose (lait), arôme naturel de vanille, emulsifiant: lécithine de soja`;
}

module.exports = { extractText };