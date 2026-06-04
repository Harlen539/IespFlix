import dotenv from "dotenv";

dotenv.config();

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_POSTER = "https://image.tmdb.org/t/p/w780";
const TMDB_IMAGE_BACKDROP = "https://image.tmdb.org/t/p/original";

const API_KEY = process.env.TMDB_API_KEY;
const BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

function hasApiKey() {
  return Boolean(hasV3ApiKey() || hasBearerToken());
}

function hasV3ApiKey() {
  return Boolean(API_KEY && API_KEY !== "SUA_CHAVE_AQUI" && !looksLikeJwt(API_KEY));
}

function hasBearerToken() {
  return Boolean((BEARER_TOKEN && BEARER_TOKEN !== "SUA_CHAVE_AQUI") || looksLikeJwt(API_KEY));
}

function getBearerToken() {
  return BEARER_TOKEN && BEARER_TOKEN !== "SUA_CHAVE_AQUI" ? BEARER_TOKEN : API_KEY;
}

function looksLikeJwt(value) {
  return typeof value === "string" && value.split(".").length === 3;
}

function imageUrl(baseUrl, path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  return `${baseUrl}${path}`;
}

async function tmdbRequest(path, params = {}) {
  const url = new URL(`${TMDB_API_BASE}${path}`);
  url.searchParams.set("language", "pt-BR");

  if (hasV3ApiKey()) {
    url.searchParams.set("api_key", API_KEY);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const requestOptions = hasBearerToken()
    ? { headers: { Authorization: `Bearer ${getBearerToken()}` } }
    : {};

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`Erro TMDB: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function ratingFor(index, mediaType) {
  if (mediaType === "tv") {
    return index % 3 === 0 ? "A16" : "A14";
  }

  return index % 4 === 0 ? "A16" : index % 3 === 0 ? "A12" : "A14";
}

function tagFor(index, mediaType) {
  if (mediaType === "tv") {
    return index % 2 === 0 ? "Nova temporada" : "Novo episódio";
  }

  return index % 2 === 0 ? "Novidade" : "Top 10";
}

function normalizeItem(raw, mediaType, genreLabel, index) {
  const title = mediaType === "movie" ? raw.title : raw.name;
  const date = mediaType === "movie" ? raw.release_date : raw.first_air_date;

  return {
    id: `${mediaType}-${raw.id}`,
    tmdbId: raw.id,
    title: title || "Título indisponível",
    description: raw.overview || "Sinopse indisponível no momento.",
    rating: ratingFor(index, mediaType),
    year: date ? date.slice(0, 4) : "2024",
    type: mediaType === "movie" ? "Filme" : "Série",
    genre: genreLabel,
    tag: tagFor(index, mediaType),
    progress: (index * 13 + 17) % 100,
    image: imageUrl(TMDB_IMAGE_POSTER, raw.poster_path),
    backdrop: imageUrl(TMDB_IMAGE_BACKDROP, raw.backdrop_path)
  };
}

function onlyWithImages(items) {
  return items.filter((item) => item.poster_path && item.backdrop_path);
}

function fallbackRawItems(mediaType, label, page = 1) {
  const movieTitles = [
    "Operacao Horizonte",
    "Cidade em Chamas",
    "Rota de Fuga",
    "Noite Sem Volta",
    "Codigo Final",
    "Ultima Frequencia",
    "Lado Oculto",
    "Plano Perfeito",
    "Depois da Tempestade",
    "Linha de Frente"
  ];

  const seriesTitles = [
    "Turma do Campus",
    "Caso Aberto",
    "Plantao 24h",
    "Arquivo Central",
    "Entre Aulas",
    "Zona de Risco",
    "Temporada Final",
    "Clube dos Genios",
    "Mapa Secreto",
    "Nova Jornada"
  ];

  const titles = mediaType === "movie" ? movieTitles : seriesTitles;
  const normalizedLabel = String(label || "catalogo").toLowerCase().replace(/\W+/g, "-");

  return titles.map((baseTitle, index) => {
    const id = page * 1000 + index + 1;
    const title = `${baseTitle}: ${label}`;
    const seed = `iespflix-${mediaType}-${normalizedLabel}-${index}`;

    return {
      id,
      title,
      name: title,
      overview: `Uma selecao de ${label} preparada para manter a IESPFLIX funcionando enquanto a chave da TMDB nao esta configurada.`,
      release_date: `${2024 - (index % 6)}-01-01`,
      first_air_date: `${2024 - (index % 6)}-01-01`,
      poster_path: `https://picsum.photos/seed/${seed}-poster/780/1170`,
      backdrop_path: `https://picsum.photos/seed/${seed}-backdrop/1600/900`
    };
  });
}

export async function discoverMoviesByGenre({ genreId, label, page = 1 }) {
  if (!hasApiKey()) {
    return fallbackRawItems("movie", label, page)
      .slice(0, 10)
      .map((item, index) => normalizeItem(item, "movie", label, index));
  }

  const data = await tmdbRequest("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    include_adult: "false",
    page
  });

  return onlyWithImages(data.results || [])
    .slice(0, 10)
    .map((item, index) => normalizeItem(item, "movie", label, index));
}

export async function discoverSeriesByGenre({ genreId, label, page = 1, extraParams = {} }) {
  if (!hasApiKey()) {
    return fallbackRawItems("tv", label, page)
      .slice(0, 10)
      .map((item, index) => normalizeItem(item, "tv", label, index));
  }

  const data = await tmdbRequest("/discover/tv", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    include_adult: "false",
    page,
    ...extraParams
  });

  return onlyWithImages(data.results || [])
    .slice(0, 10)
    .map((item, index) => normalizeItem(item, "tv", label, index));
}

export async function searchSeries({ query, label }) {
  if (!hasApiKey()) {
    return fallbackRawItems("tv", label || query)
      .slice(0, 10)
      .map((item, index) => normalizeItem(item, "tv", label, index));
  }

  const data = await tmdbRequest("/search/tv", {
    query,
    include_adult: "false",
    page: 1
  });

  return onlyWithImages(data.results || [])
    .slice(0, 10)
    .map((item, index) => normalizeItem(item, "tv", label, index));
}
