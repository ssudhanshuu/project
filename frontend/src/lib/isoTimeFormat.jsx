/**
 * Format a date/time string into 'MM/DD/YYYY, hh:mm AM/PM' format.
 * @param {string|Date} dateTime - The date/time to format.
 * @returns {string} Formatted date/time string.
 */
const isoTimeFormat = (dateTime) => {
  if (!dateTime) return "Invalid date";

  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default isoTimeFormat;
