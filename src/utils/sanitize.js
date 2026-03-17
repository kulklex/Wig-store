export const sanitizeText = (value, options = {}) => {
  const { maxLength = 300, allowNewlines = false } = options;

  if (typeof value !== "string") return "";

  let result = value.replace(/[^\x20-\x7E]/g, "");

  if (!allowNewlines) {
    result = result.replace(/\s+/g, " ");
  }

  result = result.trim();

  if (maxLength && result.length > maxLength) {
    result = result.slice(0, maxLength);
  }

  return result;
};

export const sanitizeEmail = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 254);
};

export const sanitizePhone = (value, maxLength = 20) => {
  if (typeof value !== "string") return "";
  const cleaned = value.replace(/[^\d+]/g, "").trim();
  return cleaned.slice(0, maxLength);
};


// Strips anything that isn't A-Z, 0-9, or a hyphen
export const sanitizePromoCode = (value) => {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 17);                
};