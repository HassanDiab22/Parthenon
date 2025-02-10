import { body, param } from "express-validator";
import { query } from "express-validator";
import { getModelByIdService } from "../../../services/adminPanel/modelServices.js";

export const validateCreateModel = [
  body("prismaName")
    .trim()
    .notEmpty()
    .withMessage("prismaName is required")
    .isString()
    .withMessage("prismaName must be a string")
    .matches(/^[A-Z][a-z0-9]*$/)
    .withMessage(
      "prismaName must start with an uppercase letter and contain only lowercase letters/numbers"
    ),

  body("displayName")
    .trim()
    .notEmpty()
    .withMessage("displayName is required")
    .isString()
    .withMessage("displayName must be a string")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("displayName can only contain letters and spaces"),
];

export const validateDeleteModel = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("id is required")
    .isUUID()
    .withMessage("id must be a valid UUID")
    .custom(async (id) => {
      try {
        const model = await getModelByIdService(id);
        console.log("hello world");
        if (!model) {
          return Promise.reject("Model with this ID does not exist");
        }
      } catch (error) {
        console.error("Error checking model existence:", error);
        return Promise.reject("Error verifying model existence");
      }
    }),
];
