/**
 * Parser module for extracting nutritional information from OCR text.
 * Handles multiple languages (Spanish, Dutch, German, French, Italian, English).
 */

/**
 * Parse OCR text and extract nutritional information.
 * @param {string} ocrText - The text extracted from the image
 * @returns {Object} Parsed nutritional data
 */
export function parseNutritionInfo(ocrText) {
  const lines = ocrText.split('\n');
  
  // Find the nutrition table section
  const nutritionSection = findNutritionSection(lines);
  if (!nutritionSection) {
    return { error: 'No nutrition table found' };
  }
  
  // Extract product name
  const productName = extractProductName(lines);
  
  // Extract serving size
  const servingSize = extractServingSize(lines);
  
  // Parse the nutrition table
  const nutrients = parseNutritionTable(nutritionSection);
  
  return {
    productName,
    servingSize,
    nutrients,
    ingredients: extractIngredients(lines),
    allergens: extractAllergens(lines),
  };
}

/**
 * Find the nutrition table section in the text.
 * @param {string[]} lines - Array of text lines
 * @returns {string[]|null} The nutrition table lines or null
 */
function findNutritionSection(lines) {
  const nutritionKeywords = [
    'nährwertdeklaration',
    'déclaration nutritionnelle',
    'voedingswaarde',
    'dichiarazione nutrizionale',
    'información nutricional',
    'nutritional information',
    'voedingswaarden',
    'nährwerte',
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    for (const keyword of nutritionKeywords) {
      if (line.includes(keyword)) {
        // Found the start, collect table lines
        const tableLines = [];
        for (let j = i; j < Math.min(i + 20, lines.length); j++) {
          const l = lines[j].trim();
          if (l === '' && j > i + 3) break;
          tableLines.push(l);
        }
        return tableLines;
      }
    }
  }
  return null;
}

/**
 * Extract product name from the text.
 * @param {string[]} lines - Array of text lines
 * @returns {string} Product name
 */
function extractProductName(lines) {
  // Product name is usually at the top, in larger text
  // Look for lines that are not part of the nutrition table
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line.length > 3 && line.length < 100 && !line.includes('per') && !line.includes('100')) {
      return line;
    }
  }
  return 'Unknown product';
}

/**
 * Extract serving size information.
 * @param {string[]} lines - Array of text lines
 * @returns {Object|null} Serving size info
 */
function extractServingSize(lines) {
  for (const line of lines) {
    // Look for patterns like "30 g = 1 Melto" or "per 100 ml"
    const match = line.match(/(\d+\s*g|per\s+\d+\s*ml)/i);
    if (match) {
      return { amount: match[0] };
    }
  }
  return null;
}

/**
 * Parse the nutrition table into structured data.
 * @param {string[]} tableLines - Lines of the nutrition table
 * @returns {Object} Nutrients with values per 100g/ml and per serving
 */
function parseNutritionTable(tableLines) {
  const nutrients = {};
  
  // Known nutrient names in multiple languages
  const nutrientPatterns = {
    energy: ['energie', 'énergie', 'energia', 'energy', 'calorías', 'calorias'],
    fat: ['fett', 'matières grasses', 'vetten', 'grassi', 'grasas', 'grasa', 'fat'],
    saturatedFat: ['gesättigte fettsäuren', 'acides gras saturés', 'verzadigde vetzuren', 'acidi grassi saturi', 'grasas saturadas', 'saturated fat'],
    carbohydrates: ['kohlenhydrate', 'glucides', 'koolhydraten', 'carboidrati', 'carbohidratos', 'carbohydrates'],
    sugars: ['zucker', 'sucres', 'suikers', 'zucchero', 'azucares', 'sugars'],
    fiber: ['ballaststoffe', 'fibres alimentaires', 'vezels', 'fibre', 'fibra', 'fiber'],
    protein: ['eiweiß', 'protéines', 'eiwitten', 'proteine', 'proteínas', 'protein'],
    salt: ['salz', 'sel', 'zout', 'sale', 'sal', 'salt'],
  };
  
  for (const line of tableLines) {
    const lowerLine = line.toLowerCase();
    
    for (const [nutrientKey, patterns] of Object.entries(nutrientPatterns)) {
      if (patterns.some(p => lowerLine.includes(p))) {
        // Extract numeric values from the line
        const values = extractValues(line);
        if (values.length >= 2) {
          nutrients[nutrientKey] = {
            per100g: values[0],
            perServing: values[1],
          };
        }
        break;
      }
    }
  }
  
  return nutrients;
}

/**
 * Extract numeric values from a nutrition line.
 * @param {string} line - The line text
 * @returns {number[]} Array of numeric values found
 */
function extractValues(line) {
  const values = [];
  // Match numbers with optional decimals and units
  const regex = /(\d+(?:\.\d+)?)\s*(?:g|kj|kcal|mg)?/gi;
  let match;
  while ((match = regex.exec(line)) !== null && values.length < 2) {
    values.push(parseFloat(match[1]));
  }
  return values;
}

/**
 * Extract ingredients list from the text.
 * @param {string[]} lines - Array of text lines
 * @returns {string[]} Array of ingredients
 */
function extractIngredients(lines) {
  const ingredients = [];
  let inIngredients = false;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('ingrediente') || lowerLine.includes('ingredients') || 
        lowerLine.includes('Ingrediënten') || lowerLine.includes('ingredien')) {
      inIngredients = true;
      // Get the rest of the line after "Ingredientes:"
      const parts = line.split(/[:;：]/);
      if (parts.length > 1) {
        ingredients.push(parts.slice(1).join(':').trim());
      }
      continue;
    }
    
    if (inIngredients) {
      if (line.trim() === '' || line.includes('Nährwertdeklaration') || 
          line.includes('Voedingswaarde') || line.includes('Nutritional')) {
        break;
      }
      ingredients.push(line.trim());
    }
  }
  
  return ingredients;
}

/**
 * Extract allergen information from the text.
 * @param {string[]} lines - Array of text lines
 * @returns {string[]} Array of allergens
 */
function extractAllergens(lines) {
  const allergens = [];
  let inAllergenSection = false;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('allergie') || lowerLine.includes('allergen')) {
      inAllergenSection = true;
      continue;
    }
    
    if (inAllergenSection) {
      // Common allergens
      const commonAllergens = [
        'gluten', 'lactose', 'soja', 'nueces', 'nuts', 'frutos secos',
        'mandel', 'amendoeas', 'almonds', 'cacahuete', 'peanuts',
        'huevo', 'egg', 'ovos', 'crustáceos', 'crustaceans',
        'moluscos', 'molluscs', 'mostaza', 'mustard', 'sésamo', 'sesame',
        'sulfitos', 'sulfites', 'apio', 'celery', 'altrui', 'altrui',
      ];
      
      for (const allergen of commonAllergens) {
        if (lowerLine.includes(allergen)) {
          allergens.push(allergen);
        }
      }
      
      // Stop after a few lines
      if (allergens.length > 0 && line.trim() === '') {
        break;
      }
    }
  }
  
  return allergens;
}