import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const seriesMenuLabels = [
  "Ação",
  "Adaptações de livros",
  "Anime",
  "Asiáticos",
  "Astrologia",
  "Brasileiros",
  "Britânicos",
  "Ciência e natureza",
  "Comédia",
  "Como me sinto?",
  "Documentários",
  "Drama",
  "Esportes",
  "EUA",
  "Ficção científica e fantasia",
  "Mistério",
  "Novelas",
  "Orgulho",
  "Para as crianças",
  "Policiais",
  "Reality e talk shows",
  "Romance",
  "Teen",
  "Terror"
];

const movieMenuLabels = [
  "Ação",
  "Animação",
  "Aventura",
  "Brasileiros",
  "Clássicos",
  "Comédia",
  "Documentários",
  "Drama",
  "Fantasia",
  "Ficção científica",
  "Infantis",
  "Mistério",
  "Policiais",
  "Romance",
  "Suspense",
  "Terror"
];

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function GenreFilter({ title, genres = [], selectedGenre, onChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const menuItems = useMemo(() => {
    const labels = title === "Séries" || title === "SÃ©ries" ? seriesMenuLabels : movieMenuLabels;

    return labels.map((label) => {
      const found = genres.find((genre) => {
        const genreLabel = normalize(genre.label);
        const menuLabel = normalize(label);

        return genreLabel === menuLabel || menuLabel.includes(genreLabel) || genreLabel.includes(menuLabel);
      });

      return {
        label,
        value: found?.id || "all",
        available: Boolean(found)
      };
    });
  }, [genres, title]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectGenre(value) {
    onChange(value);
    setOpen(false);
  }

  return (
    <div className={scrolled ? "page-title-area page-title-scrolled" : "page-title-area page-title-at-top"}>
      <h1>{title}</h1>

      <div className="genre-menu-wrap" ref={menuRef}>
        <button
          className="genre-menu-trigger"
          id="genre-filter"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          Gêneros
          <ChevronDown size={14} />
        </button>

        {open && (
          <div className="genre-menu" role="menu">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={selectedGenre === item.value && item.available ? "genre-menu-item active" : "genre-menu-item"}
                type="button"
                role="menuitem"
                onClick={() => selectGenre(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
