import { useEffect, useState } from "react";
import { getHomeCatalog } from "../services/api";
import AutoHeroCarousel from "../components/AutoHeroCarousel";
import Row from "../components/Row";
import TopTenRow from "../components/TopTenRow";

export default function Home() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHomeCatalog()
      .then(setCatalog)
      .catch(() => setError("Não foi possível carregar os conteúdos. Verifique se o back-end está rodando."));
  }, []);

  if (error) return <main className="content standalone-page"><p>{error}</p></main>;
  if (!catalog) return <main className="content standalone-page"><p>Carregando...</p></main>;

  return (
    <>
      <AutoHeroCarousel slides={catalog.heroSlides} />

      <main className="content content-over-hero">
        {catalog.rows.map((row) =>
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
