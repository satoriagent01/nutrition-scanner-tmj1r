/**
 * Meal Planner Module
 *
 * Allows creating meals with multiple ingredients (products with known
 * nutritional values), specifying grams of each, and computing the
 * total nutritional profile of the meal.
 */

/**
 * Represents a single ingredient in a meal.
 * @typedef {Object} MealIngredient
 * @property {string} productId - ID of the product
 * @property {string} name - Display name of the product
 * @property {number} grams - Amount in grams
 * @property {Object} nutritionPer100g - Nutritional values per 100g
 */

/**
 * Represents a complete meal.
 * @typedef {Object} Meal
 * @property {string} id - Unique meal ID
 * @property {string} name - Meal name
 * @property {string[]} ingredientIds - List of ingredient product IDs
 * @property {Object.<string, number>} ingredientGrams - productId -> grams mapping
 * @property {Date} createdAt - When the meal was created
 */

/**
 * Nutritional values per 100g of a product.
 * @typedef {Object} NutritionPer100g
 * @property {number} energyKj - Energy in kJ
 * @property {number} energyKcal - Energy in kcal
 * @property {number} fat - Fat in grams
 * @property {number} saturatedFat - Saturated fat in grams
 * @property {number} carbohydrates - Carbohydrates in grams
 * @property {number} sugars - Sugars in grams
 * @property {number} fiber - Fiber in grams
 * @property {number} protein - Protein in grams
 * @property {number} salt - Salt in grams
 */

/**
 * Nutritional values for a specific amount of a product.
 * @typedef {Object} NutritionForAmount
 * @property {number} energyKj
 * @property {number} energyKcal
 * @property {number} fat
 * @property {number} saturatedFat
 * @property {number} carbohydrates
 * @property {number} sugars
 * @property {number} fiber
 * @property {number} protein
 * @property {number} salt
 */

/**
 * Nutritional values for a complete meal.
 * @typedef {Object} MealNutrition
 * @property {number} energyKj
 * @property {number} energyKcal
 * @property {number} fat
 * @property {number} saturatedFat
 * @property {number} carbohydrates
 * @property {number} sugars
 * @property {number} fiber
 * @property {number} protein
 * @property {number} salt
 * @property {string[]} ingredientNames
 */

/**
 * Nutritional values for a specific amount of a product.
 * @param {NutritionPer100g} nutritionPer100g
 * @param {number} grams
 * @returns {NutritionForAmount}
 */
export function nutritionForAmount(nutritionPer100g, grams) {
  const factor = grams / 100;
  return {
    energyKj: Math.round(nutritionPer100g.energyKj * factor * 10) / 10,
    energyKcal: Math.round(nutritionPer100g.energyKcal * factor * 10) / 10,
    fat: Math.round(nutritionPer100g.fat * factor * 10) / 10,
    saturatedFat: Math.round(nutritionPer100g.saturatedFat * factor * 10) / 10,
    carbohydrates: Math.round(nutritionPer100g.carbohydrates * factor * 10) / 10,
    sugars: Math.round(nutritionPer100g.sugars * factor * 10) / 10,
    fiber: Math.round(nutritionPer100g.fiber * factor * 10) / 10,
    protein: Math.round(nutritionPer100g.protein * factor * 10) / 10,
    salt: Math.round(nutritionPer100g.salt * factor * 10) / 10,
  };
}

/**
 * Create a new meal.
 * @param {string} name - Meal name
 * @param {string} productId - Product ID
 * @param {number} grams - Amount in grams
 * @param {Object} productDatabase - Map of productId -> { name, nutritionPer100g }
 * @returns {Meal}
 */
export function createMeal(name, productId, grams, productDatabase) {
  const product = productDatabase[productId];
  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }
  if (grams <= 0) {
    throw new Error('Grams must be positive');
  }

  const meal = {
    id: `${productId}-${Date.now()}`,
    name,
    ingredientIds: [productId],
    ingredientGrams: { [productId]: grams },
    createdAt: new Date(),
  };
  return meal;
}

/**
 * Add an ingredient to an existing meal.
 * @param {Meal} meal
 * @param {string} productId - Product ID
 * @param {number} grams - Amount in grams
 * @param {Object} productDatabase
 * @returns {Meal} - Updated meal
 */
export function addIngredient(meal, productId, grams, productDatabase) {
  const product = productDatabase[productId];
  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }
  if (grams <= 0) {
    throw new Error('Grams must be positive');
  }

  const updatedMeal = { ...meal };
  if (updatedMeal.ingredientIds.includes(productId)) {
    updatedMeal.ingredientGrams[productId] += grams;
  } else {
    updatedMeal.ingredientIds.push(productId);
    updatedMeal.ingredientGrams[productId] = grams;
  }
  return updatedMeal;
}

/**
 * Calculate total nutrition for a meal.
 * @param {Meal} meal
 * @param {Object} productDatabase - Map of productId -> { name, nutritionPer100g }
 * @returns {MealNutrition}
 */
export function calculateMealNutrition(meal, productDatabase) {
  const totals = {
    energyKj: 0,
    energyKcal: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    salt: 0,
  };

  const ingredientNames = [];

  for (const productId of meal.ingredientIds) {
    const product = productDatabase[productId];
    if (!product) continue;

    const grams = meal.ingredientGrams[productId];
    const nutrition = nutritionForAmount(product.nutritionPer100g, grams);

    totals.energyKj += nutrition.energyKj;
    totals.energyKcal += nutrition.energyKcal;
    totals.fat += nutrition.fat;
    totals.saturatedFat += nutrition.saturatedFat;
    totals.carbohydrates += nutrition.carbohydrates;
    totals.sugars += nutrition.sugars;
    totals.fiber += nutrition.fiber;
    totals.protein += nutrition.protein;
    totals.salt += nutrition.salt;

    ingredientNames.push(product.name);
  }

  // Round all values
  for (const key of Object.keys(totals)) {
    if (typeof totals[key] === 'number') {
      totals[key] = Math.round(totals[key] * 10) / 10;
    }
  }

  return {
    ...totals,
    ingredientNames,
  };
}

/**
 * Get nutrition for a single ingredient in a meal.
 * @param {Meal} meal
 * @param {string} productId
 * @param {Object} productDatabase
 * @returns {NutritionForAmount | null}
 */
export function getIngredientNutrition(meal, productId, productDatabase) {
  const product = productDatabase[productId];
  if (!product || !meal.ingredientIds.includes(productId)) {
    return null;
  }
  const grams = meal.ingredientGrams[productId];
  return nutritionForAmount(product.nutritionPer100g, grams);
}