import { handleValidationErrors } from "../../middlewares/validations/handleValidationErrors.js";
import {
  createModelService,
  deleteModelService,
  getAllModelsService,
  getModelByIdService,
} from "../../services/adminPanel/modelServices.js";
import { removeModelFromPrismaSchema } from "../../utils/adminPanel/helpers.js";

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

export const deleteModal = async (req, res, next) => {
  if (!handleValidationErrors(req, res)) return;

  const { id } = req.params;

  const model = await getModelByIdService(id);
  const prismaName = model.prismaName;

  try {
    const deleted = await deleteModelService(prismaName);

    if (!deleted) {
      res.status(500).json({
        error: "something went wrong",
      });
    }
    const removedTable = await removeModelFromPrismaSchema(prismaName);

    if (!removedTable) {
      res.status(500).json({
        error: "something went wrong",
      });
    }
    res.status(200).json({
      message: `Model ${prismaName} Deleted Successfully`,
    });
  } catch (error) {
    next(error);
  }
};
