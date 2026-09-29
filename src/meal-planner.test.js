import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { MealPlanner } from "./meal-planner.js";

describe("MealPlanner", () => {
  test("should create a meal and add ingredients", () => {
    const planner = new MealPlanner();
    const mealId = planner.createMeal("Almuerzo");
    planner.addIngredient(mealId, {
      name: "Pollo",
      amount: 200,
      unit: "g",
      nutrition: {
        energy: 239,
        fat: 4.3,
        saturatedFat: 1.3,
        carbohydrates: 0,
        sugars: 0,
        fiber: 0,
        protein: 27,
        salt: 0.1,
      },
    });

    const meal = planner.getMeal(mealId);
    assert.strictEqual(meal.name, "Almuerzo");
    assert.strictEqual(meal.ingredients.length, 1);
    assert.strictEqual(meal.ingredients[0].name, "Pollo");
    assert.strictEqual(meal.ingredients[0].amount, 200);
  });

  test("should calculate total nutrition for a meal", () => {
    const planner = new MealPlanner();
    const mealId = planner.createMeal("Desayuno");

    planner.addIngredient(mealId, {
      name: "Pan",
      amount: 50,
      unit: "g",
      nutrition: {
        energy: 132,
        fat: 2,
        saturatedFat: 0.4,
        carbohydrates: 24,
        sugars: 3,
        fiber: 1.5,
        protein: 4,
        salt: 0.5,
      },
    });

    planner.addIngredient(mealId, {
      name: "Mantequilla",
      amount: 10,
      unit: "g",
      nutrition: {
        energy: 74,
        fat: 8.4,
        saturatedFat: 5.3,
        carbohydrates: 0.01,
        sugars: 0.01,
        fiber: 0,
        protein: 0.1,
        salt: 0.12,
      },
    });

    const totals = planner.getMealTotals(mealId);
    assert.strictEqual(totals.energy, 206);
    assert.strictEqual(totals.fat, 10.4);
    assert.strictEqual(totals.saturatedFat, 5.7);
    assert.strictEqual(totals.carbohydrates, 24.01);
    assert.strictEqual(totals.sugars, 3.02);
    assert.strictEqual(totals.fiber, 1.5);
    assert.strictEqual(totals.protein, 4.1);
    assert.strictEqual(totals.salt, 0.62);
  });

  test("should handle multiple meals", () => {
    const planner = new MealPlanner();
    const breakfastId = planner.createMeal("Desayuno");
    const lunchId = planner.createMeal("Almuerzo");

    planner.addIngredient(breakfastId, {
      name: "Yogur",
      amount: 150,
      unit: "g",
      nutrition: {
        energy: 97,
        fat: 3.3,
        saturatedFat: 2.1,
        carbohydrates: 9.6,
        sugars: 9.6,
        fiber: 0,
        protein: 3.5,
        salt: 0.1,
      },
    });

    planner.addIngredient(lunchId, {
      name: "Arroz",
      amount: 200,
      unit: "g",
      nutrition: {
        energy: 260,
        fat: 0.4,
        saturatedFat: 0.1,
        carbohydrates: 58,
        sugars: 0.1,
        fiber: 0.6,
        protein: 5,
        salt: 0.01,
      },
    });

    const meals = planner.getAllMeals();
    assert.strictEqual(meals.length, 2);
    assert.ok(meals.some((m) => m.name === "Desayuno"));
    assert.ok(meals.some((m) => m.name === "Almuerzo"));
  });

  test("should return null for non-existent meal", () => {
    const planner = new MealPlanner();
    const result = planner.getMeal("non-existent-id");
    assert.strictEqual(result, null);
  });

  test("should delete a meal", () => {
    const planner = new MealPlanner();
    const mealId = planner.createMeal("Snack");
    assert.ok(planner.getMeal(mealId));

    planner.deleteMeal(mealId);
    assert.strictEqual(planner.getMeal(mealId), null);
  });
});