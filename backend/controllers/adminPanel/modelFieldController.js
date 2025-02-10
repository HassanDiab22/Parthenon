import { validationResult } from "express-validator";
import { createModelFieldsService } from "../../services/adminPanel/modelFieldServices.js";

export const createModalFields = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fields } = req.body;

  try {
    const result = await createModelFieldsService({ fields });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res
      .status(201)
      .json({ message: "Fields created successfully", count: result.count });
  } catch (error) {
    next(error);
  }
};
