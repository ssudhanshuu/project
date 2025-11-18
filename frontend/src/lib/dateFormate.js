/**
 * Format a date string into a readable format.
 * @param {string|Date} dateStr - The date to format.
 * @param {Object} options - Optional Intl.DateTimeFormat options.
 * @param {string} locale - Locale string, default is 'en-US'.
 * @returns {string} Formatted date string.
 */
const dateFormat = (dateStr, options = {}, locale = "en-US") => {
  if (!dateStr) return "Unknown date";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    ...options,
  });
};

export default dateFormat;
