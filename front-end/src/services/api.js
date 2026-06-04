const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar dados da API");
  }

  return response.json();
}

export function getHomeCatalog() {
  return request("/api/catalog/home");
}

export function getFilmesCatalog() {
  return request("/api/catalog/filmes");
}

export function getSeriesCatalog() {
  return request("/api/catalog/series");
}

export function getBombandoCatalog() {
  return request("/api/catalog/bombando");
}

export function getMinhaListaCatalog() {
  return request("/api/catalog/minha-lista");
}

export function getIdiomasCatalog() {
  return request("/api/catalog/idiomas");
}

export function getProfiles() {
  return request("/api/profiles");
}

export function getNotifications() {
  return request("/api/notifications");
}
