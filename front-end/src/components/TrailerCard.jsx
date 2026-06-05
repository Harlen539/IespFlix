import { Play } from "lucide-react";

export default function TrailerCard({ trailer }) {
  return (
    <article className="trailer-card">
      <div className="trailer-thumb">
        {(trailer.thumbnail || trailer.image) && (
          <img src={trailer.thumbnail || trailer.image} alt={trailer.title} loading="lazy" />
        )}

        <span className="trailer-play-icon">
          <Play size={20} fill="white" />
        </span>
      </div>

      <h3>{trailer.title}</h3>
    </article>
  );
}
