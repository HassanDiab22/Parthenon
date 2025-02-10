import { body } from "express-validator";
import { FIELD_TYPES } from "../../../Configurations/adminConfig.js";

const validateType = (type) => FIELD_TYPES.includes(type);

const validateDefaultValue = (type, defaultValue) => {
  if (!validateType(type)) {
    return false;
  }

  const regex = {
    INT: /^[0-9]+$/,
    STRING: /^.*$/,
    DOUBLE: /^[0-9]*\.?[0-9]+$/,
    DATE: /^\d{4}-\d{2}-\d{2}$/,
  };

  const validators = {
    INT: () => regex.INT.test(defaultValue),
    STRING: () => typeof defaultValue === "string",
    DOUBLE: () => regex.DOUBLE.test(defaultValue),
    DATE: () =>
      regex.DATE.test(defaultValue) && !isNaN(Date.parse(defaultValue)),
  };

  return validators[type] ? validators[type]() : false;
};

export const validateModelFieldsBulk = [
  body("fields")
    .isArray({ min: 1 })
    .withMessage("Fields must be an array with at least one item"),

  body("fields.*.type")
    .isString()
    .isIn(FIELD_TYPES)
    .withMessage(`Type must be one of ${FIELD_TYPES.join(", ")}`),

  body("fields.*.defaultValue").custom((defaultValue, { req, path }) => {
    const index = path.match(/\d+/)[0];
    const type = req.body.fields[index]?.type;

    if (!validateDefaultValue(type, defaultValue)) {
      throw new Error(`Invalid defaultValue for type ${type}`);
    }
    return true;
  }),

  body("fields.*.modelId").isUUID().withMessage("modelId must be a valid UUID"),
];
