import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { parseNutritionLabel } from "./parser.js";

describe("parseNutritionLabel", () => {
  test("parses German nutrition label (chocolate bar)", () => {
    const text = `Nährwertdeklaration / Déclaration nutritionnelle / Voedingswaarde / Dichiarazione nutrizionale
100 g	30 g = 1 Melto
Energie / énergie / energie / energia	2292 kJ 549 kcal	688 kJ 165 kcal
Fett / matières grasses / vetten / grassi	33 g	10 g
davon gesättigte Fettsäuren / dont acides gras saturés / waarvan verzadigde vetzuren / di cui acidi grassi saturi	13 g	3,9 g
Kohlenhydrate / glucides / koolhydraten / carboidrati	55 g	16 g
davon Zucker / dont sucres / waarvan suikers / di cui zuccheri	45 g	14 g
Ballaststoffe / fibres alimentaires / vezels / fibre	2,4 g	0,7 g
Eiweiß / protéines / eiwitten / proteine	6,8 g	2,0 g
Salz / sel / zout / sale	0,18 g	0,05 g`;

    const result = parseNutritionLabel(text);

    assert.equal(result.productName, undefined);
    assert.equal(result.servingSize, "30 g");
    assert.equal(result.servingName, "1 Melto");
    assert.equal(result.nutrients.energy.kJ, 2292);
    assert.equal(result.nutrients.energy.kcal, 549);
    assert.equal(result.nutrients.fat, 33);
    assert.equal(result.nutrients.saturatedFat, 13);
    assert.equal(result.nutrients.carbohydrates, 55);
    assert.equal(result.nutrients.sugars, 45);
    assert.equal(result.nutrients.fiber, 2.4);
    assert.equal(result.nutrients.protein, 6.8);
    assert.equal(result.nutrients.sodium, 0.18);
  });

  test("parses Dutch nutrition label (juice)", () => {
    const text = `Voedingswaarde per	100 ml	glas (200 ml)
energie	199 kJ / 47 kcal	399 kJ / 94 kcal
vetten, waarvan	0 g	0 g
- verzadigde vetzuren	0 g	0 g
- onverzadigde vetzuren	0 g	0 g
koolhydraten, waarvan	11 g	22 g
- suikers	10 g	20 g
- zoetstoffen	0 g	0 g
vezels	0,7 g	1,4 g
eiwitten	0,4 g	0,8 g
zout	0 g	0 g`;

    const result = parseNutritionLabel(text);

    assert.equal(result.productName, undefined);
    assert.equal(result.servingSize, "200 ml");
    assert.equal(result.servingName, "glas");
    assert.equal(result.nutrients.energy.kJ, 199);
    assert.equal(result.nutrients.energy.kcal, 47);
    assert.equal(result.nutrients.fat, 0);
    assert.equal(result.nutrients.saturatedFat, 0);
    assert.equal(result.nutrients.carbohydrates, 11);
    assert.equal(result.nutrients.sugars, 10);
    assert.equal(result.nutrients.fiber, 0.7);
    assert.equal(result.nutrients.protein, 0.4);
    assert.equal(result.nutrients.sodium, 0);
  });

  test("parses Spanish nutrition label (olive oil spray)", () => {
    const text = `Voedingswaarde per 100 ml
energie	3404 kJ / 828 kcal
vetten	92 g
waarvan verzadigde vetzuren	14 g
koolhydraten	0 g
waarvan suikers	0 g
vezels	0 g
eiwitten	0 g
zout	0 g`;

    const result = parseNutritionLabel(text);

    assert.equal(result.productName, undefined);
    assert.equal(result.servingSize, "100 ml");
    assert.equal(result.servingName, undefined);
    assert.equal(result.nutrients.energy.kJ, 3404);
    assert.equal(result.nutrients.energy.kcal, 828);
    assert.equal(result.nutrients.fat, 92);
    assert.equal(result.nutrients.saturatedFat, 14);
    assert.equal(result.nutrients.carbohydrates, 0);
    assert.equal(result.nutrients.sugars, 0);
    assert.equal(result.nutrients.fiber, 0);
    assert.equal(result.nutrients.protein, 0);
    assert.equal(result.nutrients.sodium, 0);
  });

  test("returns empty result for unrecognized text", () => {
    const text = "This is not a nutrition label";
    const result = parseNutritionLabel(text);
    assert.equal(result.productName, undefined);
    assert.equal(result.nutrients.energy.kJ, 0);
    assert.equal(result.nutrients.energy.kcal, 0);
  });

  test("extracts product name from first line", () => {
    const text = `VERSGEPEERST APPEL-SINAASAPPEL- EN MANGOSAP
Voedingswaarde per	100 ml
energie	199 kJ / 47 kcal`;

    const result = parseNutritionLabel(text);
    assert.equal(result.productName, "VERSGEPEERST APPEL-SINAASAPPEL- EN MANGOSAP");
  });

  test("handles per 100ml as default serving", () => {
    const text = `Voedingswaarde per 100 ml
energie	3404 kJ / 828 kcal
vetten	92 g`;

    const result = parseNutritionLabel(text);
    assert.equal(result.servingSize, "100 ml");
  });
});