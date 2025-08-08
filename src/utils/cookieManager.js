export const COOKIE_NAME = "KarinaBeautyHub_cookie_consent";

export const getCookieConsent = () => {
  return localStorage.getItem(COOKIE_NAME);
};

export const setCookieConsent = (value, remember = false) => {
  if (remember) {
    localStorage.setItem(COOKIE_NAME, value);
  } else {
    sessionStorage.setItem(COOKIE_NAME, value);
  }
};

export const clearCookieConsent = () => {
  localStorage.removeItem(COOKIE_NAME);
  sessionStorage.removeItem(COOKIE_NAME);
};
