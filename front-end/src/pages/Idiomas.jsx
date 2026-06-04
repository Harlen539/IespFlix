import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getIdiomasCatalog } from "../services/api";
import Card from "../components/Card";

export default function Idiomas() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getIdiomasCatalog()
      .then(setCatalog)
      .catch(() => setError("Não foi possível carregar os conteúdos. Verifique se o back-end está rodando."));
  }, []);

  if (error) return <main className="content standalone-page"><p>{error}</p></main>;
  if (!catalog) return <main className="content standalone-page"><p>Carregando...</p></main>;

  return (
    <main className="content standalone-page idiomas-page">
      <div className="idiomas-header">
        <h1>Navegar por idiomas</h1>

        <div className="language-controls">
          <span>Selecione suas preferências</span>

          <button>
            Idioma original
            <ChevronDown size={16} />
          </button>

          <button>
            Inglês
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="idiomas-grid">
        {catalog.items.map((item) => (
          <Card key={item.id} item={item} large />
        ))}
      </div>
    </main>
  );
}
