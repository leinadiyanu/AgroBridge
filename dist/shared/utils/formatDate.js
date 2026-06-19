/**
 * Formats a JavaScript Date object into a readable string.
 *
 * Purpose:
 * - Ensures consistent date formatting across the application
 * - Prevents duplicate formatting logic in controllers/services
 *
 * Example output:
 * - "2026-05-23 14:30:00"
 */
export const formatDate = (date) => {
    const pad = (num) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
//# sourceMappingURL=formatDate.js.map