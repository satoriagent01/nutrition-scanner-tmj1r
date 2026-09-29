import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractText } from "./ocr.js";

describe("OCR", () => {
  test("extracts text from buffer or string", () => {
    const input = "Energie 500 kcal\nProteínas 10 g";
    const result = extractText(input);
    assert.equal(typeof result, "string");
    assert.ok(result.includes("Energie"));
  });

  test("returns empty string for invalid input", () => {
    const result = extractText(null);
    assert.equal(result, "");
  });
});