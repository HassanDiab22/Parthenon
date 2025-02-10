import express from "express";
import {
  createModel,
  getModels,
} from "../../controllers/adminPanel/modelController.js";
import { validateCreateModel } from "../../middlewares/validations/adminPanel/validateModel.js";

const router = express.Router();

router.get("/", getModels);
router.post("/", validateCreateModel, createModel);

export default router;
