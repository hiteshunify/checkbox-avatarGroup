# TypeScript Figma to Low-Code Checkbox Transformer

## Installation

1. Clone the repository or navigate to the project directory:
```bash
cd checkbox_ts
```

2. Install dependencies:
```bash
npm install
```

## Project Structure

- `transformer.ts` - Main transformation logic
- `colors.ts` - Color token mappings and utilities
- `fetchFigma.ts` - Figma API integration
- `index.ts` - Entry point
- `figmaResponse.json` - Sample Figma API response
- `transformedCheckboxes.json` - Output file

## Usage

1. Build the project:
```bash
npm run build
```

2. Run the transformer:
```bash
npm start
```

This will:
- Read the Figma response from `figmaResponse.json`
- Transform the checkbox components
- Generate `transformedCheckboxes.json` with the low-code schema
- Create `IDs.txt` with component IDs

## Scripts

- `npm run build` - Compiles TypeScript files
- `npm start` - Runs the transformer



