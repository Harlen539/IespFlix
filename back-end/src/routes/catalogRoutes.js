import { Router } from "express";
import {
  getFullCatalog,
  getHomeCatalog,
  getFilmesCatalog,
  getSeriesCatalog,
  getBombandoCatalog,
  getMinhaListaCatalog,
  getIdiomasCatalog
} from "../controllers/catalogController.js";

const router = Router();

router.get("/", getFullCatalog);
router.get("/home", getHomeCatalog);
router.get("/filmes", getFilmesCatalog);
router.get("/series", getSeriesCatalog);
router.get("/bombando", getBombandoCatalog);
router.get("/minha-lista", getMinhaListaCatalog);
router.get("/idiomas", getIdiomasCatalog);

export default router;
