import {
  discoverMoviesByGenre,
  discoverSeriesByGenre,
  searchSeries
} from "./tmdbService.js";

const CACHE_TIME = 1000 * 60 * 30;
const cache = new Map();

const movieGenreConfig = [
  { id: "acao", label: "Ação", genreId: 28 },
  { id: "suspense", label: "Suspense", genreId: 53 },
  { id: "terror", label: "Terror", genreId: 27 },
  { id: "drama", label: "Drama", genreId: 18 },
  { id: "comedia", label: "Comédia", genreId: 35 },
  { id: "romance", label: "Romance", genreId: 10749 },
  { id: "ficcao", label: "Ficção científica", genreId: 878 },
  { id: "animacao", label: "Animação", genreId: 16 },
  { id: "documentario", label: "Documentário", genreId: 99 }
];

const seriesGenreConfig = [
  { id: "drama", label: "Drama", genreId: 18 },
  { id: "crime", label: "Crime", genreId: 80 },
  { id: "suspense", label: "Suspense", genreId: 9648 },
  { id: "comedia", label: "Comédia", genreId: 35 },
  { id: "acao", label: "Ação", genreId: 10759 },
  { id: "fantasia", label: "Fantasia", genreId: 10765 },
  { id: "ficcao", label: "Ficção científica", genreId: 10765 },
  { id: "medico", label: "Médico", search: "hospital" },
  { id: "anime", label: "Anime", genreId: 16, extraParams: { with_original_language: "ja" } }
];

function getCache(key) {
  const cached = cache.get(key);

  if (!cached) return null;

  if (Date.now() - cached.createdAt > CACHE_TIME) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

function setCache(key, data) {
  cache.set(key, {
    createdAt: Date.now(),
    data
  });
}

async function cached(key, callback) {
  const existing = getCache(key);
  if (existing) return existing;

  const data = await callback();
  setCache(key, data);
  return data;
}

async function buildMovieGenres() {
  return Promise.all(
    movieGenreConfig.map(async (genre) => ({
      id: genre.id,
      label: genre.label,
      items: await discoverMoviesByGenre(genre)
    }))
  );
}

async function buildSeriesGenres() {
  return Promise.all(
    seriesGenreConfig.map(async (genre) => {
      const items = genre.search
        ? await searchSeries({ query: genre.search, label: genre.label })
        : await discoverSeriesByGenre(genre);

      return {
        id: genre.id,
        label: genre.label,
        items
      };
    })
  );
}

function makeRowsFromGenres(genres) {
  return genres.map((genre) => ({
    id: `row-${genre.id}`,
    title: genre.label,
    type: "normal",
    items: genre.items
  }));
}

function pickSlides(...genres) {
  return genres
    .flatMap((genre) => genre?.items || [])
    .filter((item) => item.backdrop)
    .slice(0, 5)
    .map((item) => ({
      ...item,
      subtitle: `${item.type} • ${item.genre} • ${item.year}`
    }));
}

export async function buildFilmesCatalog() {
  return cached("filmes", async () => {
    const genres = await buildMovieGenres();

    return {
      heroSlides: pickSlides(genres[0], genres[1], genres[6]),
      genres,
      rows: makeRowsFromGenres(genres)
    };
  });
}

export async function buildSeriesCatalog() {
  return cached("series", async () => {
    const genres = await buildSeriesGenres();

    return {
      heroSlides: pickSlides(genres[0], genres[1], genres[5]),
      genres,
      rows: [
        ...makeRowsFromGenres(genres),
        {
          id: "top-series",
          title: "Brasil: top 10 em séries hoje",
          type: "top10",
          items: genres[0]?.items || []
        }
      ]
    };
  });
}

export async function buildHomeCatalog() {
  return cached("home", async () => {
    const filmes = await buildFilmesCatalog();
    const series = await buildSeriesCatalog();

    const dramaSeries = series.genres.find((genre) => genre.id === "drama");
    const crimeSeries = series.genres.find((genre) => genre.id === "crime");
    const acaoFilmes = filmes.genres.find((genre) => genre.id === "acao");
    const suspenseFilmes = filmes.genres.find((genre) => genre.id === "suspense");

    return {
      heroSlides: pickSlides(dramaSeries, acaoFilmes, crimeSeries),
      rows: [
        {
          id: "top-series",
          title: "Brasil: top 10 em séries hoje",
          type: "top10",
          items: dramaSeries?.items || []
        },
        {
          id: "continuar",
          title: "Continuar assistindo como Manu",
          type: "normal",
          items: [
            ...(crimeSeries?.items.slice(0, 5) || []),
            ...(acaoFilmes?.items.slice(0, 5) || [])
          ]
        },
        {
          id: "dicas",
          title: "Dicas para você",
          type: "normal",
          items: [
            ...(suspenseFilmes?.items.slice(0, 5) || []),
            ...(dramaSeries?.items.slice(0, 5) || [])
          ]
        }
      ]
    };
  });
}

export async function buildBombandoCatalog() {
  return cached("bombando", async () => {
    const filmes = await buildFilmesCatalog();
    const series = await buildSeriesCatalog();

    const acao = filmes.genres.find((genre) => genre.id === "acao");
    const drama = series.genres.find((genre) => genre.id === "drama");

    return {
      rows: [
        {
          id: "novidades",
          title: "Novidades na Iespflix",
          type: "normal",
          items: [
            ...(acao?.items.slice(0, 5) || []),
            ...(drama?.items.slice(0, 5) || [])
          ]
        },
        {
          id: "top-series",
          title: "Brasil: top 10 em séries hoje",
          type: "top10",
          items: drama?.items || []
        },
        {
          id: "top-filmes",
          title: "Brasil: top 10 em filmes hoje",
          type: "top10",
          items: acao?.items || []
        }
      ]
    };
  });
}

export async function buildMinhaListaCatalog() {
  return cached("minha-lista", async () => {
    const filmes = await buildFilmesCatalog();
    const series = await buildSeriesCatalog();

    return {
      items: [
        ...series.genres[0].items.slice(0, 5),
        ...series.genres[1].items.slice(0, 5),
        ...filmes.genres[0].items.slice(0, 5),
        ...filmes.genres[1].items.slice(0, 5)
      ]
    };
  });
}

export async function buildIdiomasCatalog() {
  return cached("idiomas", async () => {
    const filmes = await buildFilmesCatalog();
    const series = await buildSeriesCatalog();

    return {
      items: [
        ...series.genres[0].items.slice(0, 8),
        ...series.genres[8].items.slice(0, 8),
        ...filmes.genres[6].items.slice(0, 8)
      ]
    };
  });
}

export async function buildFullCatalog() {
  return cached("full", async () => ({
    home: await buildHomeCatalog(),
    filmes: await buildFilmesCatalog(),
    series: await buildSeriesCatalog(),
    bombando: await buildBombandoCatalog(),
    minhaLista: await buildMinhaListaCatalog(),
    idiomas: await buildIdiomasCatalog()
  }));
}
