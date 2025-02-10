import express from "express";
import {
  createModel,
  deleteModal,
  getModels,
} from "../../controllers/adminPanel/modelController.js";
import {
  validateCreateModel,
  validateDeleteModel,
} from "../../middlewares/validations/adminPanel/validateModel.js";

const router = express.Router();

router.get("/", getModels);
router.post("/", validateCreateModel, createModel);
router.delete("/:id", validateDeleteModel, deleteModal);

export default router;
