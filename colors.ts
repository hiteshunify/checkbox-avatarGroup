// Color token mappings from design system

interface ColorToken {
    value: string;
}

export const colors: Record<string, ColorToken> = {
    // Base Colors
    'White': {
        value: '#FFFFFF'
    },
    'Black': {
        value: '#000000'
    },

    // Gray Scale
    'Gray-950': {
        value: '#0C111D'
    },
    'Gray-800': {
        value: '#182230'
    },
    'Gray-400': {
        value: '#98A2B3'
    },
    'Gray-300': {
        value: '#CFD4DE'
    },
    'Gray-200': {
        value: '#E0E3EB'
    },
    'Gray-100': {
        value: '#EDEFF4'
    },
    'Gray-50': {
        value: '#F5F6FA'
    },
    'Gray-25': {
        value: '#F9FAFD'
    },

    // Semantic Colors
    'Primary': {
        value: '#101828'
    },
    'Secondary': {
        value: '#344054'
    },
    'Tertiary': {
        value: '#475467'
    },
    'Quaternary': {
        value: '#667085'
    },

    // Brand Colors
    'Brand-Primary': {
        value: '#371b97'
    },
    'Brand-Secondary': {
        value: '#4e26db'
    },
    'Brand-Tertiary': {
        value: '#5c37eb'
    },
    'Brand-950': {
        value: '#211059'
    },
    'Brand-800': {
        value: '#421fb8'
    },
    'Brand-500': {
        value: '#705af8'
    }
};

// Helper function to get color by name
export const getColorByName = (name: string): ColorToken | undefined => {
    return colors[name];
};

// Helper function to find color name by hex value
export const getColorNameByValue = (hexValue: string): string | undefined => {
    const entry = Object.entries(colors).find(([_, color]) => 
        color.value.toLowerCase() === hexValue.toLowerCase()
    );
    return entry ? entry[0] : undefined;
};

// Helper function to find color name by RGB values
export const getColorNameByRGB = (r: number, g: number, b: number): string | undefined => {
    // Convert RGB (0-1) to hex
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    const hexValue = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return getColorNameByValue(hexValue);
};
