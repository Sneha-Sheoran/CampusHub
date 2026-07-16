function validateRequiredFields(data, requiredFields) {
  const errors = [];
  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  return errors;
}

function validatePhoneNumber(value) {
  return /^[\d\s+\-()]{7,15}$/.test(value);
}

function validateRequest(schema, req, res, next) {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: error.details.map((detail) => detail.message) });
  }
  next();
}

module.exports = {
  validateRequiredFields,
  validatePhoneNumber,
  validateRequest
};
