import { handleValidationErrors } from "../../middlewares/validations/handleValidationErrors.js";
import {
  createModelService,
  getAllModelsService,
} from "../../services/adminPanel/modelServices.js";

export const getModels = async (req, res, next) => {
  try {
    const model = await getAllModelsService({ onlyRegisteredModels: true });
    res.json(model);
  } catch (error) {
    next(error);
  }
};

export const createModel = async (req, res, next) => {
  if (!handleValidationErrors(req, res)) return;
  const { prismaName, displayName } = req.body;
  try {
    const model = await createModelService({ prismaName, displayName });
    res.json(model);
  } catch (error) {
    next(error);
  }
};
