import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractText } from "./ocr.js";

describe("OCR - extractText", () => {
  test("extracts text from a mock image buffer", () => {
    // Simulating a mock image buffer with known text
    const mockImageBuffer = Buffer.from(
      "Nährwertdeklaration\nEnergie: 2292 kJ / 549 kcal\nFett: 33 g\nKohlenhydrate: 55 g\nZucker: 45 g\nBallaststoffe: 2,4 g\nEiweiß: 6,8 g\nSalz: 0,18 g"
    );

    const result = extractText(mockImageBuffer);

    assert.ok(typeof result === "string");
    assert.ok(result.includes("Nährwertdeklaration"));
    assert.ok(result.includes("2292 kJ"));
    assert.ok(result.includes("549 kcal"));
    assert.ok(result.includes("33 g"));
    assert.ok(result.includes("55 g"));
    assert.ok(result.includes("45 g"));
    assert.ok(result.includes("2,4 g"));
    assert.ok(result.includes("6,8 g"));
    assert.ok(result.includes("0,18 g"));
  });

  test("returns empty string for empty buffer", () => {
    const emptyBuffer = Buffer.from("");
    const result = extractText(emptyBuffer);
    assert.equal(result, "");
  });

  test("handles multi-language nutrition labels", () => {
    const multiLangBuffer = Buffer.from(
      "Nährwertdeklaration / Déclaration nutritionnelle\nEnergie / énergie: 2292 kJ / 549 kcal\nFett / matières grasses: 33 g\nKohlenhydrate / glucides: 55 g\nZucker / sucres: 45 g\nBallaststoffe / fibres: 2,4 g\nEiweiß / protéines: 6,8 g\nSalz / sel: 0,18 g"
    );

    const result = extractText(multiLangBuffer);

    assert.ok(result.includes("Nährwertdeklaration"));
    assert.ok(result.includes("Déclaration nutritionnelle"));
    assert.ok(result.includes("2292 kJ"));
    assert.ok(result.includes("549 kcal"));
  });
});