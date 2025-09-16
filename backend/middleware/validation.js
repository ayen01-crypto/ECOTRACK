const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .trim(),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Activity validation
const validateActivity = [
  body('type')
    .isIn(['transportation', 'energy', 'food', 'waste', 'other'])
    .withMessage('Invalid activity type'),
  
  body('category')
    .notEmpty()
    .withMessage('Activity category is required')
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Activity description is required')
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  body('value')
    .isNumeric()
    .withMessage('Value must be a number')
    .isFloat({ min: 0 })
    .withMessage('Value cannot be negative'),
  
  body('unit')
    .isIn(['miles', 'km', 'kwh', 'gallons', 'liters', 'kg', 'lbs', 'meals', 'items', 'hours', 'other'])
    .withMessage('Invalid unit'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

// Calculator validation
const validateCalculator = [
  body('transportation')
    .optional()
    .isObject()
    .withMessage('Transportation data must be an object'),
  
  body('energy')
    .optional()
    .isObject()
    .withMessage('Energy data must be an object'),
  
  body('food')
    .optional()
    .isObject()
    .withMessage('Food data must be an object'),
  
  body('waste')
    .optional()
    .isObject()
    .withMessage('Waste data must be an object'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateActivity,
  validateCalculator
};
