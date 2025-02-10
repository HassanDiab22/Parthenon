import { validationResult } from "express-validator";

/**
 * Reusable function to check validation errors.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} - Returns false if there are validation errors, otherwise true
 */
export const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};
