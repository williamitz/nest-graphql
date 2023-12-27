
/**
 * Función que calcula el salto de registro (skip)
 * @param page current Page
 * @param rowsForPage rows for page
 * @returns Number
 */
export const onSkipCalc = ( page: number, rowsForPage: number ) => ( page - 1 ) * rowsForPage;