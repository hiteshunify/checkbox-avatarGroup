# TypeScript Figma to Low-Code Checkbox Transformer


## Project Structure

- `transformerChecbox.ts` - transformation logic for checkboxes
- `transformerAvatarGroup.ts` - transformation logic for Avatar Group
- `colors.ts` - Color token mappings and utilities
- `fetchFigma.ts` - Figma API integration
- `index.ts` - Entry point
- `figmaResponse.json` - Sample Figma API response
- `transformedCheckboxes.json` - Output file

## Usage

1. First, install the dependencies:
```bash
npm init -y
npm install
```

2. Run the files
```bash
npm start    # this will run the fetchFigma.js and will create a file named figmaResponse.json and a file ID.txt
npx ts-node transformerAvatar.ts # this will run the transformerAvatar.ts and will create transformedAvatarGroups.json
npx ts-node transformerCheckbox.ts  # this will run the transformerCheckbox.ts and will create transformedCheckbox.json
```

The transformer will:
- Read the Figma response from `figmaResponse.json`
- Transform the checkbox/avatarGroup components
- Generate `transformedCheckboxes.json` with the low-code schema
- Create `IDs.txt` with component IDs

If no checkboxes / avatarGroups are found, you'll see helpful warning messages and troubleshooting steps.




