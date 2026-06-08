import {
  Check,
  Pause,
  Play,
  Plus,
  ThumbsUp,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getFullCatalog } from "../services/api";
import MediaImage from "./MediaImage";
import SimilarTitleCard from "./SimilarTitleCard";
import TrailerCard from "./TrailerCard";

const names = [
  "Olivia Newman",
  "Sally Field",
  "Lewis Pullman",
  "Alfred Molina",
  "Colm Meaney",
  "Joan Chen",
  "Kathy Baker",
  "Donald Sase",
  "Mapuana Makia",
  "Beth Grant"
];

const trailerLabels = ["Teaser", "Trailer"];

function ratingNumber(value) {
  return String(value || "A14").replace(/^A/i, "");
}

function ratingClass(value) {
  const rating = ratingNumber(value);

  if (rating === "12") return "rating-12";
  if (rating === "16") return "rating-16";
  if (rating === "18") return "rating-18";
  return "rating-14";
}

function pickFrom(seed, index) {
  return seed.charCodeAt(index % seed.length) || index;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function mediaTypeFor(item) {
  return normalizeText(item?.type).includes("serie") ? "serie" : "filme";
}

function genreListFor(item) {
  return [item?.genre, ...(item?.genres || [])]
    .filter(Boolean)
    .map(normalizeText);
}

function keywordsFor(item) {
  const stopWords = new Set([
    "para",
    "como",
    "com",
    "uma",
    "um",
    "que",
    "por",
    "dos",
    "das",
    "seus",
    "suas",
    "sobre",
    "quando",
    "eles",
    "elas",
    "sua",
    "seu"
  ]);

  return new Set(
    normalizeText(`${item?.title || ""} ${item?.description || ""} ${item?.genre || ""}`)
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 4 && !stopWords.has(word))
  );
}

function flattenCatalogItems(value, output = []) {
  if (!value) return output;

  if (Array.isArray(value)) {
    value.forEach((entry) => flattenCatalogItems(entry, output));
    return output;
  }

  if (typeof value !== "object") return output;

  if (value.id && value.title && (value.image || value.backdrop)) {
    output.push(value);
  }

  Object.entries(value).forEach(([key, nested]) => {
    if (["image", "backdrop", "posterImage", "bannerImage", "previewImage"].includes(key)) return;
    flattenCatalogItems(nested, output);
  });

  return output;
}

function mergeCatalogItems(items) {
  const byId = new Map();

  items.forEach((item) => {
    const key = item.id || `${item.title}-${item.year}`;
    const existing = byId.get(key);

    if (!existing) {
      byId.set(key, {
        ...item,
        genres: [...new Set([...(item.genres || []), item.genre].filter(Boolean))]
      });
      return;
    }

    byId.set(key, {
      ...existing,
      ...item,
      image: existing.image || item.image,
      backdrop: existing.backdrop || item.backdrop,
      description: existing.description || item.description,
      genres: [...new Set([...(existing.genres || []), ...(item.genres || []), item.genre].filter(Boolean))]
    });
  });

  return Array.from(byId.values());
}

function scoreSimilarity(base, candidate) {
  if (!candidate || candidate.id === base.id || candidate.tmdbId === base.tmdbId) return -1;

  const baseType = mediaTypeFor(base);
  const candidateType = mediaTypeFor(candidate);
  const baseGenres = genreListFor(base);
  const candidateGenres = genreListFor(candidate);
  const sharedGenres = candidateGenres.filter((genre) => baseGenres.includes(genre));
  const baseKeywords = keywordsFor(base);
  const candidateKeywords = keywordsFor(candidate);
  let sharedKeywords = 0;

  candidateKeywords.forEach((word) => {
    if (baseKeywords.has(word)) sharedKeywords += 1;
  });

  const yearDistance = Math.abs(Number(base.year || 0) - Number(candidate.year || 0));
  let score = 0;

  if (baseType === candidateType) score += 45;
  if (sharedGenres.length) score += 70 + sharedGenres.length * 18;
  if (base.rating && candidate.rating && base.rating === candidate.rating) score += 8;
  if (candidate.description && candidate.description !== "Sinopse indisponível no momento.") score += 6;
  if (Number.isFinite(yearDistance)) score += Math.max(0, 12 - yearDistance);
  score += Math.min(sharedKeywords * 5, 30);

  return score;
}

function buildSimilarTitles(item, catalogItems) {
  const rankedItems = mergeCatalogItems(catalogItems)
    .map((candidate) => ({
      item: candidate,
      score: scoreSimilarity(item, candidate)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item: candidate }) => {
      const normalized = normalizeMovie(candidate, []);

      return {
        ...candidate,
        maturityRating: normalized.maturityRating,
        duration: normalized.type === "serie" ? normalized.episodes : normalized.duration,
        quality: normalized.quality,
        previewImage: normalized.previewImage,
        bannerImage: normalized.bannerImage,
        image: normalized.posterImage,
        description: normalized.description
      };
    });

  const sameGenreAndType = rankedItems.filter(
    (candidate) =>
      mediaTypeFor(candidate) === mediaTypeFor(item) &&
      genreListFor(candidate).some((genre) => genreListFor(item).includes(genre))
  );
  const sameGenre = rankedItems.filter((candidate) =>
    genreListFor(candidate).some((genre) => genreListFor(item).includes(genre))
  );

  return mergeCatalogItems([...sameGenreAndType, ...sameGenre, ...rankedItems]).slice(0, 6);
}

function normalizeMovie(item, catalogSimilarTitles = null) {
  const title = item?.title || "Titulo indisponivel";
  const seed = `${item?.id || title}`;
  const isSeries = item?.type === "Serie" || item?.type === "Série";
  const genre = item?.genre || "Drama";
  const duration = item?.duration || (isSeries ? "" : `${1 + (pickFrom(seed, 0) % 2)}h ${32 + (pickFrom(seed, 1) % 26)}min`);
  const episodes = item?.episodes || (isSeries ? `${6 + (pickFrom(seed, 2) % 5)} episódios` : "");
  const rating = ratingNumber(item?.maturityRating || item?.rating || "A14");
  const bannerImage = item?.bannerImage || item?.backdrop || item?.image || "";
  const posterImage = item?.posterImage || item?.image || bannerImage;
  const previewImage = item?.previewImage || item?.backdrop || item?.image || bannerImage;
  const cast = item?.cast?.length ? item.cast : names.slice(0, 5 + (pickFrom(seed, 3) % 3));
  const genres = item?.genres?.length ? item.genres : [genre, isSeries ? "Series dramaticas" : "Filmes dramaticos", "Suspense"];
  const tags = item?.tags?.length ? item.tags : ["Complexo", "Emocionante", genre];
  const description =
    item?.description ||
    `Uma história intensa em que escolhas difíceis aproximam personagens marcantes de uma verdade que muda tudo.`;

  const generatedSimilarTitles = item?.similarTitles?.length
    ? item.similarTitles
    : Array.from({ length: 6 }, (_, index) => ({
        id: `${item?.id || "movie"}-similar-${index}`,
        title: `${title.split(":")[0]} ${index + 1}`,
        year: String(Number(item?.year || 2024) - (index % 5)),
        duration: isSeries ? `${45 + index}min` : `1h ${35 + index * 3}min`,
        maturityRating: index % 3 === 0 ? "14" : "12",
        quality: "HD",
        image: index % 2 === 0 ? posterImage : previewImage,
        previewImage: index % 2 === 0 ? previewImage : posterImage,
        description:
          index % 2 === 0
          ? "Uma história envolvente com conflitos pessoais, descobertas e decisões que mudam o rumo dos personagens."
            : "Quando uma rotina tranquila sai do controle, novos encontros revelam segredos, afeto e coragem."
      }));
  const similarTitles =
    catalogSimilarTitles && catalogSimilarTitles.length ? catalogSimilarTitles : generatedSimilarTitles;

  const trailers = item?.trailers?.length
    ? item.trailers
    : trailerLabels.map((label, index) => ({
        id: `${item?.id || "movie"}-trailer-${index}`,
        title: `${label}: ${title}`,
        thumbnail: index === 0 ? previewImage : posterImage
      }));

  return {
    ...item,
    title,
    type: isSeries ? "serie" : "filme",
    year: item?.year || "2024",
    duration,
    episodes,
    maturityRating: rating,
    maturityDescription:
      item?.maturityDescription || (rating === "12" ? "violência, linguagem imprópria" : "drogas, temas sensíveis"),
    quality: item?.quality || "HD",
    description,
    cast,
    genres,
    tags,
    director: item?.director || cast[0] || "Direção indisponível",
    writers: item?.writers?.length ? item.writers : [cast[1] || "Roteiro indisponivel", cast[2] || "Equipe Iespflix"],
    bannerImage,
    posterImage,
    previewImage,
    similarTitles,
    trailers
  };
}

export default function MovieDetailsModal({
  movie,
  onClose,
  isInMyList = false,
  onToggleMyList,
  onOpenDetails
}) {
  const modalRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const [catalogItems, setCatalogItems] = useState([]);
  const realSimilarTitles = useMemo(
    () => buildSimilarTitles(movie, catalogItems),
    [catalogItems, movie]
  );
  const details = useMemo(
    () => normalizeMovie(movie, realSimilarTitles),
    [movie, realSimilarTitles]
  );
  const mediaLength = details.type === "serie" ? details.episodes : details.duration;
  const typeLabel = details.type === "serie" ? "Esta série é:" : "Este filme é:";

  function openSimilarTitle(title) {
    onOpenDetails?.(title);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    let active = true;

    getFullCatalog()
      .then((catalog) => {
        if (active) {
          setCatalogItems(flattenCatalogItems(catalog));
        }
      })
      .catch(() => {
        if (active) {
          setCatalogItems([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    modalRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [movie?.id]);

  return createPortal(
    <div className="movie-details-overlay" onMouseDown={onClose}>
      <article
        ref={modalRef}
        className="movie-details-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Mais informações sobre ${details.title}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <section className="movie-details-hero">
          <MediaImage
            src={details.bannerImage}
            alt={details.title}
            title={details.title}
            className="movie-details-hero-image"
            variant="details"
          />
          <div className="movie-details-gradient" />

          <button className="movie-details-close" type="button" aria-label="Fechar" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="movie-details-hero-content">
            <h1 className="movie-details-title">{details.title}</h1>

            <div className="movie-details-actions">
              <button
                className="play-button"
                type="button"
                aria-label={playing ? "Pausar" : "Assistir"}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? <Pause size={24} fill="black" /> : <Play size={26} fill="black" />}
                Assistir
              </button>

              <button
                className={isInMyList ? "circle-action-button active" : "circle-action-button"}
                type="button"
                aria-label={isInMyList ? "Remover da minha lista" : "Adicionar à minha lista"}
                onClick={() => onToggleMyList?.(movie)}
              >
                {isInMyList ? <Check size={23} /> : <Plus size={24} />}
              </button>

              <button
                className={liked ? "circle-action-button active" : "circle-action-button"}
                type="button"
                aria-label={liked ? "Remover gostei" : "Gostei"}
                onClick={() => setLiked((value) => !value)}
              >
                <ThumbsUp size={21} />
              </button>

              <button
                className={muted ? "circle-action-button volume-action" : "circle-action-button volume-action active"}
                type="button"
                aria-label={muted ? "Ativar som" : "Silenciar"}
                onClick={() => setMuted((value) => !value)}
              >
                {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
            </div>
          </div>
        </section>

        <div className="movie-details-body">
          <div className="movie-details-main-info">
            <div className="movie-details-meta">
              <span>{details.year}</span>
              <span>{mediaLength}</span>
              <span className="hd-badge">{details.quality}</span>
            </div>

            <div className="movie-details-warnings">
              <span className={`rating-badge ${ratingClass(details.maturityRating)}`}>
                {details.maturityRating}
              </span>
              <span>{details.maturityDescription}</span>
            </div>

            <p className="movie-details-description">{details.description}</p>
          </div>

          <aside className="movie-details-side-info">
            <p><span>Elenco:</span> {details.cast.slice(0, 5).join(", ")}, mais</p>
            <p><span>Gêneros:</span> {details.genres.join(", ")}</p>
            <p><span>{typeLabel}</span> {details.tags.join(", ")}</p>
          </aside>

          <section className="movie-details-section">
            <h2>Títulos semelhantes</h2>
            <div className="similar-grid">
              {details.similarTitles.map((title) => (
                <SimilarTitleCard
                  key={title.id || title.title}
                  title={title}
                  onSelect={openSimilarTitle}
                />
              ))}
            </div>
          </section>

          <section className="movie-details-section">
            <h2>Trailers e mais</h2>
            <div className="trailers-grid">
              {details.trailers.map((trailer) => (
                <TrailerCard key={trailer.id || trailer.title} trailer={trailer} />
              ))}
            </div>
          </section>

          <section className="movie-details-section about-info">
            <h2>Sobre {details.title}</h2>
            <p><span>Direção:</span> {details.director}</p>
            <p><span>Elenco:</span> {details.cast.join(", ")}</p>
            <p><span>Roteiro:</span> {details.writers.join(", ")}</p>
            <p><span>Gêneros:</span> {details.genres.join(", ")}</p>
            <p>
              <span>Classificação etária:</span>
              <b className={`rating-badge ${ratingClass(details.maturityRating)}`}>
                {details.maturityRating}
              </b>
              {details.maturityDescription}. Não recomendado para menores de {details.maturityRating} anos.
            </p>
          </section>
        </div>
      </article>
    </div>,
    document.body
  );
}
