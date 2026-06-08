import { Plus } from "lucide-react";
import MediaImage from "./MediaImage";

function ratingClass(rating) {
  const value = String(rating || "14").replace(/^A/i, "");

  if (value === "12") return "rating-12";
  if (value === "16") return "rating-16";
  if (value === "18") return "rating-18";
  return "rating-14";
}

export default function SimilarTitleCard({ title, onSelect }) {
  const rating = String(title.maturityRating || title.rating || "14").replace(/^A/i, "");
  const bannerImage = title.bannerImage || title.backdrop || title.previewImage || title.image;

  function openTitle() {
    onSelect?.(title);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openTitle();
    }
  }

  return (
    <article
      className="similar-card similar-card-clickable"
      role="button"
      tabIndex={0}
      onClick={openTitle}
      onKeyDown={handleKeyDown}
      aria-label={`Abrir detalhes de ${title.title}`}
    >
      <div className="similar-card-media">
        <MediaImage
          src={bannerImage}
          alt={title.title}
          title={title.title}
          variant="similar"
          loading="lazy"
        />

        <div className="similar-card-title-fade" />
        <h3 className="similar-card-title">{title.title}</h3>
        {title.duration && <span className="similar-duration">{title.duration}</span>}
      </div>

      <div className="similar-card-body">
        <div className="similar-card-meta">
          <span className={`rating-badge ${ratingClass(rating)}`}>{rating}</span>
          <span className="hd-badge">{title.quality || "HD"}</span>
          <span>{title.year}</span>

          <button
            className="similar-add-button"
            type="button"
            aria-label={`Abrir ${title.title}`}
            onClick={(event) => {
              event.stopPropagation();
              openTitle();
            }}
          >
            <Plus size={22} />
          </button>
        </div>

        <p>{title.description}</p>
      </div>
    </article>
  );
}
