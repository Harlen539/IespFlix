import { useEffect, useMemo, useState } from "react";
import { getSeriesCatalog } from "../services/api";
import AutoHeroCarousel from "../components/AutoHeroCarousel";
import GenreFilter from "../components/GenreFilter";
import Row from "../components/Row";
import TopTenRow from "../components/TopTenRow";

export default function Series() {
  const [catalog, setCatalog] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    getSeriesCatalog()
      .then(setCatalog)
      .catch(() => setError("Não foi possível carregar os conteúdos. Verifique se o back-end está rodando."));
  }, []);

  const visibleGenres = useMemo(() => {
    if (!catalog) return [];
    if (selectedGenre === "all") return catalog.genres;
    return catalog.genres.filter((genre) => genre.id === selectedGenre);
  }, [catalog, selectedGenre]);

  if (error) return <main className="content standalone-page"><p>{error}</p></main>;
  if (!catalog) return <main className="content standalone-page"><p>Carregando...</p></main>;

  return (
    <>
      <GenreFilter
        title="Séries"
        genres={catalog.genres}
        selectedGenre={selectedGenre}
        onChange={setSelectedGenre}
      />

      <AutoHeroCarousel slides={catalog.heroSlides} />

      <main className="content content-over-hero">
        {visibleGenres.map((genre) => (
          <Row key={genre.id} title={genre.label} items={genre.items} />
        ))}

        {selectedGenre === "all" &&
          catalog.rows?.map((row) =>
            row.type === "top10" ? (
              <TopTenRow key={row.id} title={row.title} items={row.items} />
            ) : (
              <Row key={row.id} title={row.title} items={row.items} />
            )
          )}
      </main>
    </>
  );
}
