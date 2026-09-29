# Nutrition Scanner - Specification

## Overview
A free, ad-free mobile-friendly web app that lets users photograph nutrition labels from food products, extract the nutritional information using OCR + AI, and then track their diet by creating custom meals with arbitrary gram amounts.

## OCR Module (`src/ocr.js`)

### `extractTextFromImage(imagePath: string): Promise<string>`
Extracts text from a photograph of a nutrition label. Uses Tesseract.js for OCR.

**Example:**
- Input: Path to image of a nutrition label
- Output: `"Nährwertdeklaration\nEnergie 2292 kJ\nFett 33 g\nKohlenhydrate 55 g\nZucker 45 g\nBallaststoffe 2,4 g\nEiweiß 6,8 g\nSalz 0,18 g"`

## Parser Module (`src/parser.js`)

### `parseNutritionTable(text: string): NutritionInfo`
Parses OCR text and extracts structured nutritional information per 100g (and optionally per serving).

**Returns:**
```js
{
  product: string,
  servingSize: string,
  servingGrams: number,
  per100g: {
    energyKj: number,
    energyKcal: number,
    fat: number,
    saturatedFat: number,
    carbohydrates: number,
    sugars: number,
    fiber: number,
    protein: number,
    salt: number
  },
  perServing: {
    energyKj: number,
    energyKcal: number,
    fat: number,
    saturatedFat: number,
    carbohydrates: number,
    sugars: number,
    fiber: number,
    protein: number,
    salt: number
  }
}
```

**Example from image 1 (chocolate hazelnut bar):**
- Product: "Barra de chocolate con leche y avellanas sin gluten"
- Serving: "30 g = 1 Melto"
- Per 100g: energy 2292 kJ / 549 kcal, fat 33g, saturated fat 13g, carbs 55g, sugars 45g, fiber 2.4g, protein 6.8g, salt 0.18g
- Per serving (30g): energy 688 kJ / 165 kcal, fat 10g, saturated fat 3.9g, carbs 16g, sugars 14g, fiber 0.7g, protein 2.0g, salt 0.05g

**Example from image 2 (apple-orange-mango juice):**
- Product: "Versgeperst appel-sinaasappel-en mangosap"
- Serving: "200 ml" (5 portions of 200ml per 1L)
- Per 100ml: energy 199 kJ / 47 kcal, fat 0g, saturated fat 0g, carbs 11g, sugars 10g, fiber 0g, protein 0.4g, salt 0g
- Per glass (200ml): energy 399 kJ / 94 kcal, fat 0g, saturated fat 0g, carbs 22g, sugars 20g, fiber 0g, protein 0.8g, salt 0g

### `parseIngredients(text: string): string[]`
Extracts the ingredients list from the OCR text.

**Example:**
- Input: "Ingrediënten: 45% appel, 35% sinaasappel, 20% mango, antioxidant (ascorbinezuur [E300])"
- Output: `["appel 45%", "sinaasappel 35%", "mango 20%", "antioxidant (ascorbinezuur [E300])"]`

## Meal Planner Module (`src/meal-planner.js`)

### `createMeal(name: string, items: MealItem[]): Meal`
Creates a meal with named items, each with a product reference and gram amount.

**MealItem:**
```js
{
  productId: string,
  grams: number,
  label?: string  // optional display name
}
```

**Returns:**
```js
{
  id: string,
  name: string,
  items: MealItem[],
  totals: NutritionInfo
}
```

### `calculateMealTotals(items: MealItem[], products: Product[]): MealTotals`
Calculates the total nutritional values for a meal based on gram amounts and product data.

**Example:**
- 50g of chocolate bar (per 100g: 549 kcal) → 274.5 kcal
- 200ml juice (per 100ml: 47 kcal) → 94 kcal
- Total: 368.5 kcal

### `addMealToDay(day: Day, meal: Meal): Day`
Adds a meal to a day's log.

## Tracker Module (`src/tracker.js`)

### `createTracker(): Tracker`
Creates a new diet tracker instance.

### `scanProduct(imagePath: string): Promise<Product>`
Scans a product from an image, runs OCR + parsing, and returns the product with nutritional info.

### `addProduct(tracker: Tracker, product: Product): Tracker`
Adds a scanned product to the tracker's database.

### `createMeal(tracker: Tracker, name: string, items: MealItem[]): Meal`
Creates a meal using products from the tracker.

### `logMeal(tracker: Tracker, meal: Meal): Tracker`
Logs a meal to the daily tracker.

### `getDaySummary(tracker: Tracker, date: string): DaySummary`
Gets the nutritional summary for a specific day.

**DaySummary:**
```js
{
  date: string,
  meals: Meal[],
  totals: NutritionInfo,
  goals: {
    energyKcal: number,
    protein: number,
    fat: number,
    carbs: number
  }
}
```

### `setGoals(tracker: Tracker, goals: Goals): Tracker`
Sets daily nutritional goals.

## Acceptance Criteria

- **AC-1:** User can take/upload a photo of a nutrition label and get structured nutritional data
- **AC-2:** Parser handles multiple languages (German, Dutch, French, Italian, Spanish)
- **AC-3:** User can create custom meals with arbitrary gram amounts of any scanned product
- **AC-4:** User can track daily intake and see totals for calories, sodium, saturated fat, and any custom macro
- **AC-5:** App is free and has no ads
- **AC-6:** All nutritional calculations are deterministic (no AI for math, only for OCR)