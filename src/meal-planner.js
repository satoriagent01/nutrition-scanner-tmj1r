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
 * @property {string} name - Display name of the product
 * @property {number} amount - Amount in grams
 * @property {string} unit - Unit of measurement
 * @property {Object} nutrition - Nutritional values per 100g
 */

/**
 * Represents a complete meal.
 * @typedef {Object} Meal
 * @property {string} id - Unique meal ID
 * @property {string} name - Meal name
 * @property {MealIngredient[]} ingredients - List of ingredients
 */

/**
 * Nutritional values per 100g of a product.
 * @typedef {Object} NutritionPer100g
 * @property {number} energy - Energy in kcal
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
 * @typedef {Object} MealTotals
 * @property {number} energy
 * @property {number} fat
 * @property {number} saturatedFat
 * @property {number} carbohydrates
 * @property {number} sugars
 * @property {number} fiber
 * @property {number} protein
 * @property {number} salt
 */

/**
 * MealPlanner class for managing meals and their nutritional calculations.
 */
class MealPlanner {
  constructor() {
    /** @type {Map<string, Meal>} */
    this.meals = new Map();
    this.nextId = 1;
  }

  /**
   * Create a new meal.
   * @param {string} name - Meal name
   * @returns {string} - Meal ID
   */
  createMeal(name) {
    const id = `meal-${this.nextId++}`;
    this.meals.set(id, { id, name, ingredients: [] });
    return id;
  }

  /**
   * Add an ingredient to an existing meal.
   * @param {string} mealId - Meal ID
   * @param {MealIngredient} ingredient - Ingredient details
   */
  addIngredient(mealId, { name, amount, unit, nutrition }) {
    const meal = this.meals.get(mealId);
    if (!meal) {
      throw new Error('Meal not found');
    }
    meal.ingredients.push({ name, amount, unit, nutrition });
  }

  /**
   * Get a meal by ID.
   * @param {string} mealId - Meal ID
   * @returns {Meal | null}
   */
  getMeal(mealId) {
    return this.meals.get(mealId) || null;
  }

  /**
   * Calculate total nutrition for a meal.
   * @param {string} mealId - Meal ID
   * @returns {MealTotals | null}
   */
  getMealTotals(mealId) {
    const meal = this.meals.get(mealId);
    if (!meal) return null;

    const totals = {
      energy: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      salt: 0,
    };

    for (const ing of meal.ingredients) {
      const factor = ing.amount / 100;
      for (const key of Object.keys(totals)) {
        totals[key] += (ing.nutrition[key] || 0) * factor;
      }
    }

    // Round to 2 decimal places
    for (const key of Object.keys(totals)) {
      totals[key] = Math.round(totals[key] * 100) / 100;
    }

    return totals;
  }

  /**
   * Get all meals.
   * @returns {Meal[]}
   */
  getAllMeals() {
    return Array.from(this.meals.values());
  }

  /**
   * Delete a meal.
   * @param {string} mealId - Meal ID
   */
  deleteMeal(mealId) {
    this.meals.delete(mealId);
  }
}

export { MealPlanner };