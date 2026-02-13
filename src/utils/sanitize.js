export const sanitizeText = (value, options = {}) => {
  const { maxLength = 300, allowNewlines = false } = options;

  if (typeof value !== "string") return "";

  let result = value.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");

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

