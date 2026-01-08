
const EN_LAYOUT = "qwertyuiop[]asdfghjkl;'zxcvbnm,./`";
const UA_LAYOUT = "йцукенгшщзхїфівапролджєячсмитьбю.'";
const EN_LAYOUT_UPPER = "QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>?~";
const UA_LAYOUT_UPPER = "ЙЦУКЕНГШЩЗХЇФІВАПРОЛДЖЄЯЧСМИТЬБЮ,₴";

// Mapping from char to char
const MAP: Record<string, string> = {};

function addToMap(from: string, to: string) {
    for (let i = 0; i < from.length; i++) {
        const f = from[i];
        const t = to[i] || '';
        if (f && t) {
            MAP[f] = t;
            MAP[t] = f; // Bidirectional
        }
    }
}

addToMap(EN_LAYOUT, UA_LAYOUT);
addToMap(EN_LAYOUT_UPPER, UA_LAYOUT_UPPER);

/**
 * Returns alternative search query by swapping layout
 * "test" -> "еуіе"
 * "ігра" -> "srhf"
 */
export function getLayoutSwappedString(input: string): string {
    return input
        .split('')
        .map((char) => MAP[char] || char)
        .join('');
}

/**
 * Returns list of search queries (original + swapped)
 */
export function getSearchVariations(input: string): string[] {
    if (!input) return [];

    const variations = new Set<string>();
    const normalized = input.toLowerCase();

    variations.add(normalized);

    // Create swapped version
    const swapped = getLayoutSwappedString(input).toLowerCase();

    // Only add if it's different
    if (swapped !== normalized) {
        variations.add(swapped);
    }

    return Array.from(variations);
}
