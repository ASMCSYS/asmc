/**
 * Utility function to get status colors for chips
 * @param {boolean} status - The status value (true for active/show, false for inactive/hide)
 * @returns {Object} Object containing background and text colors
 */
export const getStatusColor = (status) => {
    return status 
        ? { background: "#e8f5e9", text: "#2e7d32" } 
        : { background: "#ffebee", text: "#d32f2f" };
}; 