# Plan: Nutrition Scanner

## Visión
Una app gratuita y sin anuncios para escanear etiquetas nutricionales de productos y trackear la dieta de forma personalizada.

## Arquitectura

### Módulos

1. **OCR** (`src/ocr.js`) - Extrae texto de imágenes de etiquetas nutricionales usando Tesseract.js
2. **Parser** (`src/parser.js`) - Parsea el texto OCR para extraer información nutricional estructurada
3. **Meal Planner** (`src/meal-planner.js`) - Crea platos combinando productos escaneados
4. **Tracker** (`src/tracker.js`) - Registra comidas y muestra historial con totales

### Stack
- **Node.js 24** - Runtime
- **Tesseract.js** - OCR para extraer texto de imágenes
- **Node.js Test Runner** - Tests unitarios
- **GitHub Actions** - CI/CD

## Decisiones Técnicas

1. **OCR con Tesseract.js**: Librería open-source que funciona en el navegador y Node.js, sin necesidad de API keys pagas
2. **Parser determinístico**: Regex y lógica para extraer valores nutricionales del texto OCR, no IA
3. **Datos en memoria**: Para la primera versión, los datos se mantienen en memoria (sin base de datos)
4. **CLI**: Interfaz de línea de comandos para máxima portabilidad

## Próximos Pasos
- Soporte para múltiples idiomas en el parser
- Persistencia con archivos JSON
- Interfaz web con React
- Exportación de datos
- Soporte para escaneo de códigos de barras