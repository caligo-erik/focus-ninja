"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTags = extractTags;
function extractTags(tagValue, tagKeys, fallbackValues = {}) {
    if (!tagValue || tagValue.trim() === '' || tagValue.trim().toUpperCase() === 'NULL') {
        return tagKeys.reduce((acc, key) => {
            if (fallbackValues[key]) {
                acc[key] = fallbackValues[key];
            }
            else {
                acc[key] = '';
            }
            return acc;
        }, {});
    }
    const parsedTags = JSON.parse(tagValue);
    if (Array.isArray(parsedTags) || typeof parsedTags !== 'object' || parsedTags === null) {
        throw new Error('Invalid JSON format');
    }
    return tagKeys.reduce((acc, key) => {
        acc[key] = parsedTags[key] ?? fallbackValues[key] ?? '';
        return acc;
    }, {});
}
