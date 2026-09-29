import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "./app.js";

describe("App", () => {
  describe("createApp", () => {
    test("returns an object with expected methods", () => {
      const app = createApp();
      assert.equal(typeof app.addProduct, "function");
      assert.equal(typeof app.createMeal, "function");
      assert.equal(typeof app.addFoodToMeal, "function");
      assert.equal(typeof app.getMealSummary, "function");
      assert.equal(typeof app.addMealToDay, "function");
      assert.equal(typeof app.getDaySummary, "function");
      assert.equal(typeof app.getHistory, "function");
    });

    test("initial state is empty", () => {
      const app = createApp();
      assert.equal(app.products.size, 0);
      assert.equal(app.meals.size, 0);
      assert.equal(app.history.length, 0);
    });
  });
});