# Nutrition Scanner

App gratuita para escanear etiquetas nutricionales de productos del supermercado y trackear tu dieta sin anuncios ni suscripciones.

## Características

- **OCR con IA**: Extrae texto de fotos de etiquetas nutricionales
- **Parser inteligente**: Identifica automáticamente calorías, grasas, carbohidratos, proteínas, sodio y más
- **Meal Planner**: Crea platos personalizados con gramos de cada ingrediente
- **Tracker**: Registra comidas y ve tu historial nutricional
- **Multi-idioma**: Soporta etiquetas en español, inglés, alemán, francés, neerlandés, italiano y más

## Instalación

```bash
npm install
```

## Uso

```bash
node src/app.js
```

El menú interactivo te guiará por:
1. Escanear una etiqueta (subir foto)
2. Crear un plato personalizado
3. Registrar una comida
4. Ver historial

## Tests

```bash
npm test
```

## Stack

- **Node.js 24** - Runtime JavaScript
- **Tesseract.js** - OCR para extracción de texto de imágenes
- **Node Test Runner** - Tests determinísticos

## Lo que no está hecho aún

- Interfaz gráfica (actualmente es CLI)
- Base de datos persistente (los datos se pierden al cerrar)
- Sincronización en la nube
- Reconocimiento de código de barras
- Base de datos de productos pre-cargada

## Licencia

MIT - Gratis para siempre, sin anuncios.