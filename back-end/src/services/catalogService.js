import {
  discoverMoviesByGenre,
  discoverSeriesByGenre,
  searchSeries
} from "./tmdbService.js";

const CACHE_TIME = 1000 * 60 * 30;
const cache = new Map();

const movieGenreConfig = [
  { id: "acao", label: "Ação", genreId: 28 },
  { id: "aventura", label: "Aventura", genreId: 12 },
  { id: "suspense", label: "Suspense", genreId: 53 },
  { id: "terror", label: "Terror", genreId: 27 },
  { id: "drama", label: "Drama", genreId: 18 },
  { id: "comedia", label: "Comédia", genreId: 35 },
  { id: "romance", label: "Romance", genreId: 10749 },
  { id: "ficcao", label: "Ficção científica", genreId: 878 },
  { id: "animacao", label: "Animação", genreId: 16 },
  { id: "anime", label: "Anime", genreId: 16, extraParams: { with_original_language: "ja" } },
  { id: "familia", label: "Família", genreId: 10751 },
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
  { id: "anime", label: "Anime", genreId: 16, extraParams: { with_original_language: "ja" } },
  { id: "documentario", label: "Documentários", genreId: 99 },
  { id: "familia", label: "Para toda a família", genreId: 10751 }
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

function genreById(catalog, id) {
  return catalog.genres.find((genre) => genre.id === id);
}

function pickSlides(...genres) {
  return genres
    .flatMap((genre) => genre?.items || [])
    .filter((item) => item.backdrop)
    .slice(0, 6)
    .map((item) => ({
      ...item,
      subtitle: `${item.type} • ${item.genre} • ${item.year}`
    }));
}

function combine(...groups) {
  const seen = new Set();

  return groups
    .flat()
    .filter(Boolean)
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
}

async function buildFavoriteAnimeItems() {
  const [dragonBall, dragonBallZ, dragonBallSuper, onePiece] = await Promise.all([
    searchSeries({ query: "Dragon Ball", label: "Anime" }),
    searchSeries({ query: "Dragon Ball Z", label: "Anime" }),
    searchSeries({ query: "Dragon Ball Super", label: "Anime" }),
    searchSeries({ query: "One Piece", label: "Anime" })
  ]);

  return combine(dragonBall, dragonBallZ, dragonBallSuper, onePiece);
}

export async function buildFilmesCatalog() {
  return cached("filmes", async () => {
    const genres = await buildMovieGenres();

    return {
      heroSlides: pickSlides(genres[0], genres[1], genres[7]),
      genres,
      rows: [
        {
          id: "top-filmes",
          title: "Brasil: top 10 em filmes hoje",
          type: "top10",
          items: genres[0]?.items || []
        }
      ]
    };
  });
}

export async function buildSeriesCatalog() {
  return cached("series", async () => {
    const genres = await buildSeriesGenres();
    const favoriteAnime = await buildFavoriteAnimeItems();

    return {
      heroSlides: pickSlides(genres[0], genres[1], genres[5]),
      genres,
      rows: [
        {
          id: "favoritos-anime",
          title: "Dragon Ball e One Piece para fãs de verdade",
          type: "normal",
          items: favoriteAnime
        },
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
    const favoriteAnime = await buildFavoriteAnimeItems();

    const dramaSeries = genreById(series, "drama");
    const crimeSeries = genreById(series, "crime");
    const comediaSeries = genreById(series, "comedia");
    const animeSeries = genreById(series, "anime");
    const acaoFilmes = genreById(filmes, "acao");
    const aventuraFilmes = genreById(filmes, "aventura");
    const suspenseFilmes = genreById(filmes, "suspense");
    const ficcaoFilmes = genreById(filmes, "ficcao");
    const animeFilmes = genreById(filmes, "anime");
    const familiaFilmes = genreById(filmes, "familia");

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
          id: "top-filmes",
          title: "Brasil: top 10 em filmes hoje",
          type: "top10",
          items: acaoFilmes?.items || []
        },
        {
          id: "continuar",
          title: "Continuar assistindo como Manu",
          type: "normal",
          items: combine(
            crimeSeries?.items.slice(0, 7) || [],
            acaoFilmes?.items.slice(0, 7) || [],
            dramaSeries?.items.slice(0, 4) || []
          )
        },
        {
          id: "dicas",
          title: "Dicas para você",
          type: "normal",
          items: combine(
            suspenseFilmes?.items.slice(0, 8) || [],
            dramaSeries?.items.slice(4, 12) || []
          )
        },
        {
          id: "aventuras",
          title: "Aventuras e ação para maratonar",
          type: "normal",
          items: combine(
            aventuraFilmes?.items.slice(0, 9) || [],
            acaoFilmes?.items.slice(7, 16) || []
          )
        },
        {
          id: "ficcao",
          title: "Mundos de ficção científica",
          type: "normal",
          items: ficcaoFilmes?.items || []
        },
        {
          id: "series-leves",
          title: "Séries para rir e relaxar",
          type: "normal",
          items: comediaSeries?.items || []
        },
        {
          id: "favoritos-anime",
          title: "Dragon Ball e One Piece para fãs de verdade",
          type: "normal",
          items: favoriteAnime
        },
        {
          id: "anime",
          title: "Animes em destaque",
          type: "normal",
          items: combine(
            favoriteAnime,
            animeSeries?.items || [],
            animeFilmes?.items || []
          )
        },
        {
          id: "familia-anime",
          title: "Para assistir em família",
          type: "normal",
          items: combine(
            familiaFilmes?.items.slice(0, 9) || [],
            animeSeries?.items.slice(0, 9) || []
          )
        }
      ]
    };
  });
}

export async function buildBombandoCatalog() {
  return cached("bombando", async () => {
    const filmes = await buildFilmesCatalog();
    const series = await buildSeriesCatalog();
    const favoriteAnime = await buildFavoriteAnimeItems();

    const acao = genreById(filmes, "acao");
    const aventura = genreById(filmes, "aventura");
    const animeFilmes = genreById(filmes, "anime");
    const drama = genreById(series, "drama");
    const crime = genreById(series, "crime");
    const animeSeries = genreById(series, "anime");

    return {
      rows: [
        {
          id: "novidades",
          title: "Novidades na Iespflix",
          type: "normal",
          items: combine(
            acao?.items.slice(0, 7) || [],
            drama?.items.slice(0, 7) || [],
            aventura?.items.slice(0, 4) || []
          )
        },
        {
          id: "mais-buscados",
          title: "Mais buscados esta semana",
          type: "normal",
          items: combine(
            crime?.items.slice(0, 8) || [],
            aventura?.items.slice(4, 12) || []
          )
        },
        {
          id: "anime-bombando",
          title: "Animes bombando",
          type: "normal",
          items: combine(
            favoriteAnime,
            animeSeries?.items.slice(0, 9) || [],
            animeFilmes?.items.slice(0, 9) || []
          )
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
      items: combine(
        series.genres[0].items.slice(0, 7),
        series.genres[1].items.slice(0, 7),
        filmes.genres[0].items.slice(0, 7),
        filmes.genres[2].items.slice(0, 7)
      )
    };
  });
}

export async function buildIdiomasCatalog() {
  return cached("idiomas", async () => {
    const filmes = await buildFilmesCatalog();
    const series = await buildSeriesCatalog();

    return {
      items: combine(
        series.genres[0].items.slice(0, 10),
        series.genres[8].items.slice(0, 10),
        filmes.genres[7].items.slice(0, 10)
      )
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
