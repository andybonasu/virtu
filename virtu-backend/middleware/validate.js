const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

const validate = (validations) => async (req, res, next) => {
  try {
    console.log("✅ Running validation middleware...");

    // Run all validation checks
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`❌ Validation failed: ${JSON.stringify(errors.array())}`);
      console.log("❌ Validation failed. Returning response...");
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("✅ Validation passed. Moving to next middleware/controller...");
    next();
  } catch (error) {
    logger.error(`🔥 Unexpected error in validation middleware: ${error.message}`);
    console.error("🔥 Unexpected validation error:", error);
    return res.status(500).json({ error: "Internal server error during validation." });
  }
};

module.exports = validate;
