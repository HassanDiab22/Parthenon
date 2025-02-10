import express from "express";
import modelRoutes from "./modelRoutes.js";
import modelFieldRoutes from "./modelFieldRoutes.js";

const router = express.Router();

router.use("/models", modelRoutes);
router.use("/modelField", modelFieldRoutes);

export default router;
