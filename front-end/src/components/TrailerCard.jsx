import { Play } from "lucide-react";
import MediaImage from "./MediaImage";

export default function TrailerCard({ trailer }) {
  return (
    <article className="trailer-card">
      <div className="trailer-thumb">
        <MediaImage
          src={trailer.thumbnail || trailer.image}
          alt={trailer.title}
          title={trailer.title}
          variant="trailer"
          loading="lazy"
        />

        <span className="trailer-play-icon">
          <Play size={20} fill="white" />
        </span>
      </div>

      <h3>{trailer.title}</h3>
    </article>
  );
}
