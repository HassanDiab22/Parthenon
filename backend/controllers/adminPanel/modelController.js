import { getAllModelsService } from "../../services/adminPanel/modelServices.js";

export const getModels = async (req, res, next) => {
  try {
    const model = await getAllModelsService({ onlyRegisteredModels: true });
    res.json(model);
  } catch (error) {
    next(error);
  }
};
