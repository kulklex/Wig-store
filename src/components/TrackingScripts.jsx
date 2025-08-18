import { useEffect } from "react";
import { getCookieConsent } from "../utils/cookieManager";

const TrackingScripts = () => {
  useEffect(() => {
    const consent = getCookieConsent();
    if (consent === "accepted") {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID";
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "GA_TRACKING_ID");
    }
  }, []);

  return null;
};

export default TrackingScripts;
