import { useRef } from "react";

const PREVIEW_WIDTH = 306;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function Card({ item, large = false, variant = "" }) {
  const cardRef = useRef(null);

  const fallback = {
    background: "linear-gradient(135deg, #111827, #7f1d1d)"
  };
  const className = [
    "card",
    large ? "card-large" : "",
    variant === "top10" ? "card-top10" : ""
  ].filter(Boolean).join(" ");

  function openPreview(event) {
    event.preventDefault();
    event.stopPropagation();

    const rect = cardRef.current?.getBoundingClientRect();
    const previewHeight = 330;
    const position = rect
      ? {
          left: clamp(
            rect.left + rect.width / 2 - PREVIEW_WIDTH / 2,
            10,
            window.innerWidth - PREVIEW_WIDTH - 10
          ),
          top: clamp(rect.top - 78, 10, window.innerHeight - previewHeight - 10)
        }
      : { left: 16, top: 96 };

    window.dispatchEvent(new CustomEvent("iespflix:open-preview", {
      detail: {
        item,
        position
      }
    }));
  }

  function schedulePreviewClose() {
    window.dispatchEvent(new CustomEvent("iespflix:schedule-close-preview"));
  }

  return (
    <article
      ref={cardRef}
      className={className}
      style={!item.image ? fallback : {}}
      onMouseEnter={openPreview}
      onMouseLeave={schedulePreviewClose}
      onFocus={openPreview}
      onBlur={schedulePreviewClose}
      onClick={openPreview}
      onPointerUp={openPreview}
      tabIndex={0}
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="card-real-image"
          loading="lazy"
        />
      )}

      <div className="card-shine" />

      <span className="card-title">{item.title}</span>

      {item.tag && <span className="card-tag">{item.tag}</span>}
      {variant === "top10" && <span className="card-watch-now">Assista já</span>}

      {typeof item.progress === "number" && (
        <div className="progress-bar">
          <span style={{ width: `${item.progress}%` }} />
        </div>
      )}
    </article>
  );
}
