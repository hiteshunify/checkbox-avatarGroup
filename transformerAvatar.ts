import { readFileSync, writeFileSync } from 'fs';

interface AvatarGroupItem {
    fallbackText: string;
    label: string;
    type: string;
    value: string;
    blockId?: string;
    id?: string;
}

interface AvatarGroupSchema {
    component: {
        componentType: string;
        appearance: {
            maxVisibleAvatars: number;
            size: string;
            styles: {
                padding: { l: string };
                width: string;
            };
        };
        content: {
            type: string;
            avatarGroupItems: AvatarGroupItem[];
        };
    };
    visibility: { value: boolean };
    dpOn: any[];
    displayName: string;
    dataSourceIds: string[];
    id: string;
    parentId: string;
}

function normalizeValue(name: string) {
    return 'avatar' + name.replace(/[^a-zA-Z0-9]/g, '');
}

function extractAvatarNameFromStyle(styleName: string): string {
    // e.g. "Avatar user square/Andi Lane" => "Andi Lane"
    const parts = styleName.split('/');
    return parts[parts.length - 1].trim();
}

function mapFigmaNodeToStyles(node: any): any {
    const styles: any = {};
    // Padding (only left if present)
    if (node.boundVariables && node.boundVariables.itemSpacing) {
        styles.padding = { l: node.boundVariables.itemSpacing.value || 'ps-md' };
    }
    // Box shadow
    if (node.effects && Array.isArray(node.effects)) {
        const shadow = node.effects.find((e: any) => e.type === 'DROP_SHADOW');
        if (shadow) {
            styles.boxShadow = 'shadow-3xl'; // You may want to map this more precisely
        }
    }
    // Border color
    if (node.strokes && node.strokes.length > 0 && node.strokes[0].color) {
        styles.borderColor = 'border-success'; // Map to semantic if possible
    }
    // Margin (example: all sides, if present)
    if (node.absoluteBoundingBox && node.absoluteBoundingBox.margin) {
        styles.margin = { all: node.absoluteBoundingBox.margin };
    }
    // Background color
    if (node.fills && node.fills.length > 0 && node.fills[0].color) {
        styles.backgroundColor = 'bg-brand-darker'; // Map to semantic if possible
    }
    // Overflow
    if (node.scrollBehavior) {
        styles.overflow = { all: node.scrollBehavior === 'SCROLLS' ? 'overflow-visible' : node.scrollBehavior };
    }
    // Border radius
    if (typeof node.cornerRadius === 'number') {
        styles.borderRadius = { all: 'rounded-5xl' }; // Map to semantic if possible
    }
    // Border width
    if (typeof node.strokeWeight === 'number') {
        styles.borderWidth = { all: 'border-4' }; // Map to semantic if possible
    }
    // Width
    if (node.layoutSizingHorizontal === 'FIXED' || node.absoluteBoundingBox) {
        styles.width = 'w-fit';
    }
    return styles;
}

function transformAvatarGroupNode(node: any, nodeId: string, styles: Record<string, any>): AvatarGroupSchema {
    // Find the Avatars frame
    const avatarsFrame = node.children?.find((child: any) => child.name === 'Avatars');
    const avatarNodes = avatarsFrame?.children?.filter((child: any) => child.name === 'Avatar') || [];

    // Map avatar nodes to avatarGroupItems
    const avatarGroupItems: AvatarGroupItem[] = avatarNodes.map((avatarNode: any, idx: number) => {
        let fallbackText = '';
        // Try to extract from styles.fill
        if (avatarNode.styles && avatarNode.styles.fill) {
            const styleId = avatarNode.styles.fill;
            const style = styles[styleId];
            if (style && style.name) {
                fallbackText = extractAvatarNameFromStyle(style.name);
            }
        }
        // If not found, try to extract from fills style
        if (!fallbackText && avatarNode.fills && Array.isArray(avatarNode.fills)) {
            for (const fill of avatarNode.fills) {
                if (fill.styleId && styles[fill.styleId] && styles[fill.styleId].name) {
                    fallbackText = extractAvatarNameFromStyle(styles[fill.styleId].name);
                    break;
                }
            }
        }
        // If still not found, fallback to default
        if (!fallbackText) {
            fallbackText = `Avatar ${idx + 1}`;
        }
        // For Avatar 6 and above (idx >= 5), add blockId and id
        if (idx >= 5) {
            const generatedId = `avatarGroup_${Math.random().toString(36).substr(2, 6)}`;
            return {
                blockId: "__PLACEHOLDER__",
                label: fallbackText,
                id: generatedId,
                type: 'icon',
                value: generatedId,
                fallbackText
            };
        }
        // For Avatar 1-5
        return {
            fallbackText,
            label: fallbackText,
            type: 'icon',
            value: fallbackText ? normalizeValue(fallbackText) : `avatar${idx + 1}`
        };
    });

    // Map Figma node to styles
    const mappedStyles = mapFigmaNodeToStyles(node);

    return {
        component: {
            componentType: 'AvatarGroup',
            appearance: {
                maxVisibleAvatars: node.componentProperties?.maxVisibleAvatars?.value || 3,
                size: node.componentProperties?.Size?.value || 'sm',
                styles: mappedStyles
            },
            content: {
                type: 'STATIC',
                avatarGroupItems
            }
        },
        visibility: { value: true },
        dpOn: [],
        displayName: node.name ? node.name.replace(/\s/g, '_') : `AvatarGroup_${nodeId}`,
        dataSourceIds: [],
        id: nodeId,
        parentId: 'root_id'
    };
}

function transformFigmaToAvatarGroups(figmaJson: any): Record<string, AvatarGroupSchema> {
    if (!figmaJson?.Result?.nodes) {
        throw new Error('Invalid Figma JSON structure: Missing Result.nodes');
    }
    const result: Record<string, AvatarGroupSchema> = {};
    const nodes = figmaJson.Result.nodes;
    const styles = figmaJson.Result.styles || {};
    for (const [nodeId, nodeData] of Object.entries(nodes)) {
        const document = (nodeData as any).document;
        if (!document) continue;
        if (document.type === 'INSTANCE' && document.name === 'Avatar group') {
            const avatarGroupId = `b_${nodeId}`;
            result[avatarGroupId] = transformAvatarGroupNode(document, avatarGroupId, styles);
        }
    }
    return result;
}

try {
    const figmaJson = JSON.parse(readFileSync('figmaResponse.json', 'utf-8'));
    const transformedData = transformFigmaToAvatarGroups(figmaJson);
    if (Object.keys(transformedData).length > 0) {
        writeFileSync('transformedAvatarGroups.json', JSON.stringify(transformedData, null, 2));
        console.log('✅ AvatarGroup transformation complete! Check transformedAvatarGroups.json');
    } else {
        console.warn('❌ No AvatarGroup components were found');
    }
} catch (error) {
    if (error instanceof Error) {
        console.error('Error:', error.message);
    } else {
        console.error('Unknown error occurred');
    }
    process.exit(1);
}
