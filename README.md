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

1. First, install the dependencies:
```bash
npm install
```

2. You have several ways to run the project:

a. Build and run (production):
```bash
npm run build   # Compiles TypeScript to JavaScript
npm start       # Runs the compiled code
```

b. Run directly with ts-node (development):
```bash
npm run dev        # Runs index.ts with ts-node
npm run transform  # Runs transformer.ts directly
npm run fetch     # Runs fetchFigma.ts to get fresh data
```

The transformer will:
- Read the Figma response from `figmaResponse.json`
- Transform the checkbox components
- Generate `transformedCheckboxes.json` with the low-code schema
- Create `IDs.txt` with component IDs

If no checkboxes are found, you'll see helpful warning messages and troubleshooting steps.

## Scripts

- `npm run build` - Compiles TypeScript files
- `npm start` - Runs the transformer



