import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Tracker } from "./tracker.js";

describe("Tracker", () => {
  test("should register a meal and return its ID", () => {
    const tracker = new Tracker();
    const meal = {
      name: "Desayuno",
      date: "2024-01-15",
      items: [
        { productName: "Cereal", grams: 50, nutrition: { energy: 200, protein: 5, carbs: 40, fat: 2, fiber: 3, sugar: 5, sodium: 100 } }
      ]
    };
    const id = tracker.registerMeal(meal);
    assert.ok(typeof id === "string");
    assert.ok(id.length > 0);
  });

  test("should calculate total nutrition for a meal", () => {
    const tracker = new Tracker();
    const meal = {
      name: "Almuerzo",
      date: "2024-01-15",
      items: [
        { productName: "Pollo", grams: 200, nutrition: { energy: 360, protein: 60, carbs: 0, fat: 10, fiber: 0, sugar: 0, sodium: 120 } },
        { productName: "Arroz", grams: 150, nutrition: { energy: 195, protein: 4, carbs: 45, fat: 0.5, fiber: 0.5, sugar: 0, sodium: 5 } }
      ]
    };
    const totals = tracker.calculateMealTotals(meal);
    assert.strictEqual(totals.energy, 555);
    assert.strictEqual(totals.protein, 64);
    assert.strictEqual(totals.carbs, 45);
    assert.strictEqual(totals.fat, 10.5);
    assert.strictEqual(totals.fiber, 0.5);
    assert.strictEqual(totals.sugar, 0);
    assert.strictEqual(totals.sodium, 125);
  });

  test("should get daily totals", () => {
    const tracker = new Tracker();
    const breakfast = {
      name: "Desayuno",
      date: "2024-01-15",
      items: [
        { productName: "Cereal", grams: 50, nutrition: { energy: 200, protein: 5, carbs: 40, fat: 2, fiber: 3, sugar: 5, sodium: 100 } }
      ]
    };
    const lunch = {
      name: "Almuerzo",
      date: "2024-01-15",
      items: [
        { productName: "Pollo", grams: 200, nutrition: { energy: 360, protein: 60, carbs: 0, fat: 10, fiber: 0, sugar: 0, sodium: 120 } }
      ]
    };
    tracker.registerMeal(breakfast);
    tracker.registerMeal(lunch);
    const dailyTotals = tracker.getDailyTotals("2024-01-15");
    assert.strictEqual(dailyTotals.energy, 560);
    assert.strictEqual(dailyTotals.protein, 65);
    assert.strictEqual(dailyTotals.carbs, 40);
    assert.strictEqual(dailyTotals.fat, 12);
    assert.strictEqual(dailyTotals.fiber, 3);
    assert.strictEqual(dailyTotals.sugar, 5);
    assert.strictEqual(dailyTotals.sodium, 220);
  });

  test("should return empty totals for a day with no meals", () => {
    const tracker = new Tracker();
    const dailyTotals = tracker.getDailyTotals("2024-01-15");
    assert.deepStrictEqual(dailyTotals, { energy: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });
  });

  test("should get meal history", () => {
    const tracker = new Tracker();
    const breakfast = {
      name: "Desayuno",
      date: "2024-01-15",
      items: [
        { productName: "Cereal", grams: 50, nutrition: { energy: 200, protein: 5, carbs: 40, fat: 2, fiber: 3, sugar: 5, sodium: 100 } }
      ]
    };
    const lunch = {
      name: "Almuerzo",
      date: "2024-01-15",
      items: [
        { productName: "Pollo", grams: 200, nutrition: { energy: 360, protein: 60, carbs: 0, fat: 10, fiber: 0, sugar: 0, sodium: 120 } }
      ]
    };
    tracker.registerMeal(breakfast);
    tracker.registerMeal(lunch);
    const history = tracker.getMealHistory("2024-01-15");
    assert.strictEqual(history.length, 2);
    assert.strictEqual(history[0].name, "Desayuno");
    assert.strictEqual(history[1].name, "Almuerzo");
  });

  test("should handle multiple meals on different days", () => {
    const tracker = new Tracker();
    const mondayBreakfast = {
      name: "Desayuno Lunes",
      date: "2024-01-15",
      items: [
        { productName: "Cereal", grams: 50, nutrition: { energy: 200, protein: 5, carbs: 40, fat: 2, fiber: 3, sugar: 5, sodium: 100 } }
      ]
    };
    const tuesdayLunch = {
      name: "Almuerzo Martes",
      date: "2024-01-16",
      items: [
        { productName: "Ensalada", grams: 300, nutrition: { energy: 150, protein: 8, carbs: 15, fat: 6, fiber: 5, sugar: 4, sodium: 200 } }
      ]
    };
    tracker.registerMeal(mondayBreakfast);
    tracker.registerMeal(tuesdayLunch);
    
    const mondayTotals = tracker.getDailyTotals("2024-01-15");
    assert.strictEqual(mondayTotals.energy, 200);
    
    const tuesdayTotals = tracker.getDailyTotals("2024-01-16");
    assert.strictEqual(tuesdayTotals.energy, 150);
  });
});