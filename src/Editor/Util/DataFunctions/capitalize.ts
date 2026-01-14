// https://flaviocopes.com/how-to-uppercase-first-letter-javascript/

/**
 * Capitalizes the first letter of a string
 * @param s - The string to capitalize
 * @returns The capitalized string, or empty string if input is not a string
 */
const capitalize = (s: unknown): string => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export default capitalize;