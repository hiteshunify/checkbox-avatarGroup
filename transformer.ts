import { readFileSync, writeFileSync } from 'fs';
import { getColorNameByRGB } from './colors';

interface CheckboxAddOn {
    variant: string;
    weight: string;
    color: string;
}

interface TextStyle {
    text: string;
    style: {
        variant: string;
        weight: string;
        color: string;
    };
}

interface ExtractedContent {
    label: TextStyle;
    description: TextStyle;
}

interface CheckboxSchema {
    component: {
        componentType: string;
        appearance: {
            size: string;
        };
        content: {
            help: string;
            addOns: {
                label: CheckboxAddOn;
                description: CheckboxAddOn;
                help: CheckboxAddOn;
            };
            defaultValue: string;
            description: string;
            label: string;
        };
    };
    visibility: {
        value: boolean;
    };
    dpOn: any[];
    displayName: string;
    dataSourceIds: string[];
    id: string;
    parentId: string;
}

function getColorToken(color: { r: number, g: number, b: number }): string {
    // Try to find a matching color token
    const colorName = getColorNameByRGB(color.r, color.g, color.b);
    if (colorName) {
        return colorName;
    }
    
    // Fallback to RGB value if no token matches
    return `rgb(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)})`;
}

function extractTextContent(node: any): ExtractedContent {
    const textContainer = node.children?.find((child: any) => 
        child.name === "Text and supporting text"
    );

    if (!textContainer) {
        return {
            label: { text: "", style: { variant: "", weight: "", color: "" } },
            description: { text: "", style: { variant: "", weight: "", color: "" } }
        };
    }

    const labelNode = textContainer.children?.find((child: any) => 
        child.name === "Text"
    );
    const descriptionNode = textContainer.children?.find((child: any) => 
        child.name === "Supporting text"
    );

    return {
        label: {
            text: labelNode?.characters || "",
            style: {
                variant: `text-${labelNode?.style?.fontSize || 'sm'}`,
                weight: labelNode?.style?.fontWeight === 500 ? "medium" : "regular",
                color: labelNode?.fills?.[0]?.color ? getColorToken(labelNode.fills[0].color) : "Secondary"
            }
        },
        description: {
            text: descriptionNode?.characters || "",
            style: {
                variant: `text-${descriptionNode?.style?.fontSize || 'xs'}`,
                weight: descriptionNode?.style?.fontWeight === 500 ? "medium" : "regular",
                color: descriptionNode?.fills?.[0]?.color ? getColorToken(descriptionNode.fills[0].color) : "Tertiary"
            }
        }
    };
}

function transformCheckboxNode(node: any, nodeId: string): CheckboxSchema {
    const { label, description } = extractTextContent(node);
    const componentProps = node.componentProperties || {};
    
    // Extract default value from the Checked property
    const defaultValue = componentProps.Checked?.value === "True" ? "true" : 
                        componentProps.Checked?.value === "False" ? "false" : "";

    console.log('Component Properties:', JSON.stringify(componentProps, null, 2));
    console.log('Default Value:', defaultValue);

    return {
        component: {
            componentType: componentProps.Type?.value || "Checkbox",
            appearance: {
                size: componentProps.Size?.value || ""
            },
            content: {
                help: "",
                addOns: {
                    label: {
                        variant: label.style.variant,
                        weight: label.style.weight,
                        color: label.style.color
                    },
                    description: {
                        variant: description.style.variant,
                        weight: description.style.weight,
                        color: description.style.color
                    },
                    help: {
                        variant: "",
                        weight: "",
                        color: ""
                    }
                },
                defaultValue: defaultValue,
                description: description.text,
                label: label.text
            }
        },
        visibility: {
            value: true
        },
        dpOn: [],
        displayName: node.name || `Checkbox_${nodeId}`,
        dataSourceIds: [],
        id: nodeId,
        parentId: "root_id"
    };
}

function transformFigmaToSchemas(figmaJson: any): Record<string, CheckboxSchema> {
    const result: Record<string, CheckboxSchema> = {};
    const nodes = figmaJson.Result.nodes || {};

    for (const [nodeId, nodeData] of Object.entries(nodes)) {
        const document = (nodeData as any).document;
        
        if (document.type === "INSTANCE" && 
            document.componentProperties?.Type?.value === "Checkbox") {
            
            // For debugging
            console.log('Processing Node:', nodeId);
            console.log('Node Data:', JSON.stringify(document.componentProperties, null, 2));
            
            const checkboxId = `b_${nodeId}`;
            result[checkboxId] = transformCheckboxNode(document, checkboxId);
        }
    }

    return result;
}

try {
    const figmaJson = JSON.parse(readFileSync('figmaResponse.json', 'utf-8'));
    const transformedData = transformFigmaToSchemas(figmaJson);
    writeFileSync(
        'transformedCheckboxes.json', 
        JSON.stringify(transformedData, null, 2)
    );
    console.log('Transformation complete! Check transformedCheckboxes.json');
} catch (error) {
    console.error('Error:', error);
}