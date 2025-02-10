import express from "express";
import { createModalFields } from "../../controllers/adminPanel/modelFieldController.js";
import { validateModelFieldsBulk } from "../../middlewares/validations/adminPanel/validateModalFields.js";

const router = express.Router();

router.post("/", validateModelFieldsBulk, createModalFields);

export default router;
