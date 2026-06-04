import {
  buildFullCatalog,
  buildHomeCatalog,
  buildFilmesCatalog,
  buildSeriesCatalog,
  buildBombandoCatalog,
  buildMinhaListaCatalog,
  buildIdiomasCatalog
} from "../services/catalogService.js";

function sendError(res, error) {
  console.error(error);
  res.status(500).json({
    message: "Erro ao carregar catálogo da Iespflix.",
    details: error.message
  });
}

export async function getFullCatalog(req, res) {
  try {
    res.json(await buildFullCatalog());
  } catch (error) {
    sendError(res, error);
  }
}

export async function getHomeCatalog(req, res) {
  try {
    res.json(await buildHomeCatalog());
  } catch (error) {
    sendError(res, error);
  }
}

export async function getFilmesCatalog(req, res) {
  try {
    res.json(await buildFilmesCatalog());
  } catch (error) {
    sendError(res, error);
  }
}

export async function getSeriesCatalog(req, res) {
  try {
    res.json(await buildSeriesCatalog());
  } catch (error) {
    sendError(res, error);
  }
}

export async function getBombandoCatalog(req, res) {
  try {
    res.json(await buildBombandoCatalog());
  } catch (error) {
    sendError(res, error);
  }
}

export async function getMinhaListaCatalog(req, res) {
  try {
    res.json(await buildMinhaListaCatalog());
  } catch (error) {
    sendError(res, error);
  }
}

export async function getIdiomasCatalog(req, res) {
  try {
    res.json(await buildIdiomasCatalog());
  } catch (error) {
    sendError(res, error);
  }
}
