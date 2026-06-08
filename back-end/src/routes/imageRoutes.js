import { Router } from "express";
import { Readable } from "node:stream";

const router = Router();
const allowedHosts = new Set([
  "image.tmdb.org",
  "picsum.photos"
]);

router.get("/", async (req, res) => {
  const source = String(req.query.url || "");

  let imageUrl;
  try {
    imageUrl = new URL(source);
  } catch {
    res.status(400).json({ message: "URL de imagem inválida." });
    return;
  }

  if (!allowedHosts.has(imageUrl.hostname)) {
    res.status(403).json({ message: "Host de imagem não permitido." });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      res.status(response.status).json({ message: "Imagem não encontrada." });
      return;
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");

    Readable.fromWeb(response.body).pipe(res);
  } catch {
    clearTimeout(timeout);
    res.status(502).json({ message: "Não foi possível carregar a imagem." });
  }
});

export default router;
