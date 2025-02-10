import { body } from "express-validator";

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
