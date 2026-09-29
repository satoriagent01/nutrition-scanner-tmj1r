/**
 * Aplicación principal para Nutrition Scanner.
 * Expone una API unificada que conecta OCR, parser, meal planner y tracker.
 */

import { MealPlanner } from "./meal-planner.js";
import { Tracker } from "./tracker.js";
import { scanImage } from "./ocr.js";
import { parseNutritionLabel } from "./parser.js";

/**
 * Crea la instancia principal de la aplicación.
 * @returns {{ addProduct, createMeal, addFoodToMeal, getMealSummary, addMealToDay, getDaySummary, getHistory }}
 */
function createApp() {
  const meals = new MealPlanner();
  const tracker = new Tracker();
  const products = new Map();

  /**
   * Agrega un producto escaneado al catálogo.
   * @param {string} productId
   * @param {string} name
   * @param {Object} nutritionPer100g
   */
  function addProduct(productId, name, nutritionPer100g) {
    products.set(productId, { id: productId, name, nutritionPer100g });
  }

  /**
   * Crea un nuevo plato.
   * @param {string} name
   * @returns {string} mealId
   */
  function createMeal(name) {
    return meals.createMeal(name);
  }

  /**
   * Agrega un alimento a un plato.
   * @param {string} mealId
   * @param {Object} food - { name, grams, unit, nutritionPer100g }
   */
  function addFoodToMeal(mealId, food) {
    meals.addIngredient(mealId, {
      name: food.name,
      amount: food.grams,
      unit: food.unit || "g",
      nutrition: food.nutritionPer100g,
    });
  }

  /**
   * Obtiene el resumen nutricional de un plato.
   * @param {string} mealId
   * @returns {Object|null}
   */
  function getMealSummary(mealId) {
    return meals.getMealTotals(mealId);
  }

  /**
   * Registra un plato en el historial de un día.
   * @param {string} mealId
   * @param {string} date - YYYY-MM-DD
   */
  function addMealToDay(mealId, date) {
    const meal = meals.getMeal(mealId);
    if (!meal) throw new Error("Meal not found");

    const totals = meals.getMealTotals(mealId);
    const foods = meal.ingredients.map((ing) => ({
      name: ing.name,
      grams: ing.amount,
      nutritionPer100g: ing.nutrition,
    }));

    tracker.registerMeal({ id: mealId, name: meal.name, foods }, totals, date);
  }

  /**
   * Obtiene el resumen del día.
   * @param {string} date
   * @returns {Object|null}
   */
  function getDaySummary(date) {
    return tracker.getDailySummary(date);
  }

  /**
   * Obtiene el historial.
   * @param {string} [date] - Opcional, si no se pasa devuelve todo
   * @returns {Array}
   */
  function getHistory(date) {
    return tracker.getHistory(date);
  }

  /**
   * Escanea una imagen y devuelve la información nutricional extraída.
   * @param {Buffer} imageBuffer
   * @returns {Object}
   */
  function scanAndParse(imageBuffer) {
    const text = scanImage(imageBuffer);
    return parseNutritionLabel(text);
  }

  return {
    addProduct,
    createMeal,
    addFoodToMeal,
    getMealSummary,
    addMealToDay,
    getDaySummary,
    getHistory,
    scanAndParse,
    products,
  };
}

export { createApp };