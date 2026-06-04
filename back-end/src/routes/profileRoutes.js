import { Router } from "express";
import { getProfiles } from "../controllers/profileController.js";

const router = Router();

router.get("/", getProfiles);

export default router;
