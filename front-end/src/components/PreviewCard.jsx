import { Check, ChevronDown, Pause, Play, Plus, ThumbsUp, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MediaImage from "./MediaImage";

export default function PreviewCard({
  item,
  position,
  onClose,
  isInMyList = false,
  onToggleMyList,
  onOpenDetails
}) {
  const previewRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);

  const durationLabel = item.type === "Série" ? "6 episódios" : "2h";
  const ratingNumber = String(item.rating || "A14").replace(/^A/i, "");
  const tags = item.genre
    ? ["Distópico", "Complexo", item.genre]
    : ["Distópico", "Complexo", "Cyberpunk"];

  useEffect(() => {
    function handlePointerDown(event) {
      if (previewRef.current && !previewRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", onClose);
    window.addEventListener("scroll", onClose, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("scroll", onClose, true);
    };
  }, [onClose]);

  return createPortal(
    <article
      className="preview-card"
      ref={previewRef}
      onMouseEnter={() => window.dispatchEvent(new CustomEvent("iespflix:cancel-close-preview"))}
      onMouseLeave={() => window.dispatchEvent(new CustomEvent("iespflix:schedule-close-preview"))}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`
      }}
    >
      <div className="preview-media">
        <MediaImage
          src={item.backdrop || item.image}
          alt={item.title}
          title={item.title}
          variant="preview"
        />

        <div className="preview-media-fade" />
        <p className="preview-title-on-media">{item.title}</p>

        <button
          className={muted ? "preview-volume" : "preview-volume active"}
          type="button"
          aria-label={muted ? "Ativar som" : "Silenciar"}
          onClick={() => setMuted((value) => !value)}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="preview-body">
        <div className="preview-actions">
          <button
            className={playing ? "preview-round preview-play active" : "preview-round preview-play"}
            type="button"
            aria-label={playing ? "Pausar" : "Assistir"}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <Pause size={21} fill="black" /> : <Play size={22} fill="black" />}
          </button>

          <button
            className={isInMyList ? "preview-round active" : "preview-round"}
            type="button"
            aria-label={isInMyList ? "Remover da minha lista" : "Adicionar à minha lista"}
            onClick={() => onToggleMyList?.(item)}
          >
            {isInMyList ? <Check size={22} /> : <Plus size={22} />}
          </button>

          <button
            className={liked ? "preview-round active" : "preview-round"}
            type="button"
            aria-label={liked ? "Remover gostei" : "Gostei"}
            onClick={() => setLiked((value) => !value)}
          >
            <ThumbsUp size={19} />
          </button>

          <button
            className="preview-round preview-more"
            type="button"
            aria-label="Mais informações"
            onClick={() => onOpenDetails?.(item)}
          >
            <ChevronDown size={22} />
          </button>
        </div>

        <div className="preview-meta">
          <span className="preview-rating">{ratingNumber}</span>
          <span>{durationLabel}</span>
          <span className="preview-hd">HD</span>
        </div>

        <p className="preview-genres">
          {tags.map((tag, index) => (
            <span key={`${item.id}-${tag}`}>
              {index > 0 && <b>&bull;</b>}
              {tag}
            </span>
          ))}
        </p>

        <p className="preview-description">
          {item.description || "Uma história intensa com personagens marcantes e escolhas difíceis."}
        </p>
      </div>
    </article>,
    document.body
  );
}
