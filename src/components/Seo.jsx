import { useEffect, useMemo } from "react";

const formatUrl = (input, siteUrl) => {
  if (!input) return "";
  try {
    return new URL(input, siteUrl).href;
  } catch (err) {
    return input;
  }
};

const updateMetaTag = (selector, attributes) => {
  if (typeof document === "undefined") return;
  let tag = document.head.querySelector(selector);

  if (!attributes.content) {
    if (tag) document.head.removeChild(tag);
    return;
  }

  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
};

const updateLinkTag = (rel, href) => {
  if (typeof document === "undefined" || !href) return;
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const updateStructuredData = (structuredData) => {
  if (typeof document === "undefined") return;
  const existing = document.getElementById("seo-structured-data");

  if (!structuredData) {
    if (existing) existing.remove();
    return;
  }

  const script = existing || document.createElement("script");
  script.type = "application/ld+json";
  script.id = "seo-structured-data";
  script.textContent = JSON.stringify(structuredData);

  if (!existing) {
    document.head.appendChild(script);
  }
};

const Seo = ({
  title = "Karina Hair | Luxury Wigs & Extensions",
  description = "Premium human hair wigs, lace frontals, and extensions crafted for natural looks and all-day comfort.",
  canonicalPath = "/",
  image = "/android-chrome-512x512.png",
  ogType = "website",
  noIndex = false,
  structuredData = null,
}) => {
  const serializedLd = useMemo(
    () => (structuredData ? JSON.stringify(structuredData) : null),
    [structuredData]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
    const canonicalUrl = formatUrl(canonicalPath || window.location.href, siteUrl);
    const imageUrl = formatUrl(image, siteUrl);

    document.title = title;

    updateMetaTag('meta[name="description"]', {
      name: "description",
      content: description,
    });

    updateMetaTag('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow",
    });

    updateLinkTag("canonical", canonicalUrl);

    updateMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    updateMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    updateMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: ogType,
    });
    updateMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    updateMetaTag('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });

    updateMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    updateMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    updateMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    updateMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageUrl,
    });

    updateStructuredData(serializedLd ? JSON.parse(serializedLd) : null);
  }, [title, description, canonicalPath, image, ogType, noIndex, serializedLd]);

  return null;
};

export default Seo;

