import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function hashText(value = "") {
  return Array.from(value).reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) % 360;
  }, 17);
}

function fallbackStyle(title, variant) {
  const hue = hashText(`${title}-${variant}`);
  const accent = (hue + 34) % 360;

  return {
    "--fallback-a": `hsl(${hue} 68% 22%)`,
    "--fallback-b": `hsl(${accent} 76% 38%)`
  };
}

function proxyImageSource(src) {
  return `${API_URL}/api/images?url=${encodeURIComponent(src)}`;
}

function resolveImageSources(src) {
  if (!src) return [];

  try {
    const url = new URL(src);

    if (url.hostname === "image.tmdb.org" || url.hostname === "picsum.photos") {
      return [src, proxyImageSource(src)];
    }
  } catch {
    return [src];
  }

  return [src];
}

export default function MediaImage({
  src,
  alt = "",
  title = alt,
  className = "",
  fallbackClassName = "",
  variant = "poster",
  loading
}) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const style = useMemo(() => fallbackStyle(title, variant), [title, variant]);
  const imageSources = useMemo(() => resolveImageSources(src), [src]);
  const imageSource = imageSources[sourceIndex];

  useEffect(() => {
    setSourceIndex(0);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    if (!imageSource || failed || imageSources.length < 2 || sourceIndex > 0) return;

    const timer = setTimeout(() => {
      setSourceIndex(1);
    }, 2200);

    return () => clearTimeout(timer);
  }, [failed, imageSource, imageSources.length, sourceIndex]);

  function tryNextSource() {
    setSourceIndex((current) => {
      const next = current + 1;
      if (next < imageSources.length) return next;

      setFailed(true);
      return current;
    });
  }

  return (
    <div
      className={[className, "media-shell", fallbackClassName].filter(Boolean).join(" ")}
      role="img"
      aria-label={alt || title}
    >
      <div className="media-fallback" style={style}>
        <span className="media-fallback-brand">IESPFLIX</span>
        <span className="media-fallback-title">{title}</span>
      </div>

      {imageSource && !failed && (
        <img
          key={imageSource}
          src={imageSource}
          alt=""
          loading={loading}
          decoding="async"
          onError={tryNextSource}
        />
      )}
    </div>
  );
}
