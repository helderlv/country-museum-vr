/**
 * Fonction utilitaire pour découper un texte en lignes avec une limite de caractères
 * @param {string} text - Le texte à découper
 * @param {number} maxChars - Nombre maximum de caractères par ligne
 * @returns {string[]} - Tableau de lignes
 */
export function wrapText(text, maxChars = 53) {
    const words = text.trim().replace(/\s+/g, ' ').split(' ').filter(w => w.length > 0);
    const lines = [];
    let current = '';

    for (const word of words) {
        const candidate = current ? current + ' ' + word : word;
        if (candidate.length > maxChars) {
            if (current) lines.push(current);
            current = word;
        } else {
            current = candidate;
        }
    }

    if (current) lines.push(current);
    return lines;
}
