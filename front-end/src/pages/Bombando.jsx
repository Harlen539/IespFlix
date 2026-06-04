import { useEffect, useState } from "react";
import { getBombandoCatalog } from "../services/api";
import Row from "../components/Row";
import TopTenRow from "../components/TopTenRow";

export default function Bombando() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getBombandoCatalog()
      .then(setCatalog)
      .catch(() => setError("Não foi possível carregar os conteúdos. Verifique se o back-end está rodando."));
  }, []);

  if (error) return <main className="content standalone-page"><p>{error}</p></main>;
  if (!catalog) return <main className="content standalone-page"><p>Carregando...</p></main>;

  return (
    <main className="content standalone-page">
      {catalog.rows.map((row) =>
        row.type === "top10" ? (
          <TopTenRow key={row.id} title={row.title} items={row.items} />
        ) : (
          <Row key={row.id} title={row.title} items={row.items} />
        )
      )}
    </main>
  );
}
