export function toHex(v) {
    const hex = v.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

export function rgbToHex(r, g, b) {
    return '#' + toHex(r) + toHex(g) + toHex(b);
}