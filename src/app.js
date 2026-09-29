/**
 * Aplicación CLI principal para Nutrition Scanner.
 * Proporciona un menú interactivo para escanear etiquetas,
 * crear platos y trackear la dieta.
 */

import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { scanImage } from './ocr.js';
import { parseNutritionLabel } from './parser.js';
import { createMeal, addFoodToMeal, calculateMealTotals } from './meal-planner.js';
import { registerMeal, getHistory, getDailySummary } from './tracker.js';

/**
 * Crea la interfaz de línea de comandos interactiva.
 * @returns {Promise<void>}
 */
async function main() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) =>
    new Promise((resolve) => rl.question(prompt, resolve));

  let running = true;

  while (running) {
    console.log('\n========================================');
    console.log('   NUTRITION SCANNER');
    console.log('========================================');
    console.log('1. Escanear etiqueta nutricional');
    console.log('2. Crear plato');
    console.log('3. Ver historial');
    console.log('4. Salir');
    console.log('========================================');

    const choice = await question('Elige una opción: ');

    switch (choice.trim()) {
      case '1':
        await handleScan(rl);
        break;
      case '2':
        await handleMealPlanner(rl);
        break;
      case '3':
        await handleHistory(rl);
        break;
      case '4':
        console.log('¡Hasta luego!');
        running = false;
        break;
      default:
        console.log('Opción no válida.');
    }
  }

  rl.close();
}

/**
 * Maneja el flujo de escaneo de etiquetas.
 * @param {import('node:readline').Interface} rl
 */
async function handleScan(rl) {
  console.log('\n--- Escanear Etiqueta ---');
  console.log('Ingresa la ruta de la imagen de la etiqueta:');
  const imagePath = await question('Ruta: ');

  if (!imagePath.trim()) {
    console.log('Ruta no proporcionada.');
    return;
  }

  try {
    const imageBuffer = readFileSync(imagePath.trim());
    console.log('Procesando imagen...');

    const ocrText = scanImage(imageBuffer);
    console.log('\nTexto extraído:');
    console.log(ocrText);

    const nutritionInfo = parseNutritionLabel(ocrText);
    console.log('\nInformación nutricional detectada:');
    console.log(JSON.stringify(nutritionInfo, null, 2));

    const save = await question('¿Guardar en el meal planner? (s/n): ');
    if (save.trim().toLowerCase() === 's') {
      console.log('Información guardada. Puedes usarla al crear un plato.');
    }
  } catch (error) {
    console.error('Error al procesar la imagen:', error.message);
  }
}

/**
 * Maneja el flujo del meal planner.
 * @param {import('node:readline').Interface} rl
 */
async function handleMealPlanner(rl) {
  console.log('\n--- Meal Planner ---');

  console.log('Ingresa el nombre del plato:');
  const mealName = await question('Nombre: ');

  if (!mealName.trim()) {
    console.log('Nombre no proporcionado.');
    return;
  }

  const meal = createMeal(mealName.trim());

  let addingFood = true;
  while (addingFood) {
    console.log('\nAgregar alimento al plato:');
    console.log('Ingresa el nombre del alimento:');
    const foodName = await question('Alimento: ');

    if (!foodName.trim()) {
      addingFood = false;
      continue;
    }

    console.log('Ingresa la cantidad en gramos:');
    const grams = await question('Gramos: ');

    console.log('Ingresa las calorías por 100g:');
    const calories = await question('Calorías/100g: ');

    console.log('Ingresa las proteínas por 100g (g):');
    const protein = await question('Proteínas/100g: ');

    console.log('Ingresa las grasas por 100g (g):');
    const fat = await question('Grasas/100g: ');

    console.log('Ingresa los carbohidratos por 100g (g):');
    const carbs = await question('Carbos/100g: ');

    console.log('Ingresa el sodio por 100g (mg):');
    const sodium = await question('Sodio/100g: ');

    addFoodToMeal(meal.id, {
      name: foodName.trim(),
      grams: parseFloat(grams) || 0,
      caloriesPer100g: parseFloat(calories) || 0,
      proteinPer100g: parseFloat(protein) || 0,
      fatPer100g: parseFloat(fat) || 0,
      carbsPer100g: parseFloat(carbs) || 0,
      sodiumPer100g: parseFloat(sodium) || 0,
    });

    const more = await question('¿Agregar otro alimento? (s/n): ');
    if (more.trim().toLowerCase() !== 's') {
      addingFood = false;
    }
  }

  const totals = calculateMealTotals(meal.id);
  console.log('\n--- Resumen del plato ---');
  console.log(`Plato: ${meal.name}`);
  console.log(`Calorías: ${totals.calories} kcal`);
  console.log(`Proteínas: ${totals.protein} g`);
  console.log(`Grasas: ${totals.fat} g`);
  console.log(`Carbohidratos: ${totals.carbs} g`);
  console.log(`Sodio: ${totals.sodium} mg`);

  const save = await question('¿Guardar este plato en el tracker? (s/n): ');
  if (save.trim().toLowerCase() === 's') {
    registerMeal(meal);
    console.log('Plato guardado en el tracker.');
  }
}

/**
 * Maneja la visualización del historial.
 * @param {import('node:readline').Interface} rl
 */
async function handleHistory(rl) {
  console.log('\n--- Historial ---');

  console.log('¿Qué día quieres ver? (YYYY-MM-DD, o "hoy" para hoy):');
  const dateInput = await question('Fecha: ');

  const date = dateInput.trim().toLowerCase() === 'hoy'
    ? new Date().toISOString().split('T')[0]
    : dateInput.trim();

  const history = getHistory(date);
  const summary = getDailySummary(date);

  if (history.length === 0) {
    console.log('No hay comidas registradas para esta fecha.');
    return;
  }

  console.log(`\nComidas del ${date}:`);
  history.forEach((meal, index) => {
    console.log(`\n--- Plato ${index + 1}: ${meal.name} ---`);
    meal.foods.forEach((food) => {
      console.log(`  - ${food.name}: ${food.grams}g`);
    });
  });

  console.log('\n--- Resumen del día ---');
  console.log(`Calorías: ${summary.calories} kcal`);
  console.log(`Proteínas: ${summary.protein} g`);
  console.log(`Grasas: ${summary.fat} g`);
  console.log(`Carbohidratos: ${summary.carbs} g`);
  console.log(`Sodio: ${summary.sodium} mg`);
}

export { main };

// Ejecutar si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}