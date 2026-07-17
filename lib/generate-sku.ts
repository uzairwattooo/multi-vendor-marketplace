export function generateSku(): string {
    return `SKU-${crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)
        .toUpperCase()}`;
}