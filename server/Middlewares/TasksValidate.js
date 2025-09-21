import Joi from "joi";

// Joi validation schema for a task
export const taskValidation = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  dueDate: Joi.date().optional(),
  owner: Joi.string().optional(),
  desc: Joi.string().max(1000).optional(),
  completed: Joi.boolean().optional(),
  check: Joi.boolean().optional(),
  image: Joi.string().hex().length(24).optional(), // MongoDB ObjectId
  boss: Joi.string().hex().length(24).optional(),  // MongoDB ObjectId
  priority: Joi.string().valid("easy", "medium", "hard").optional()
});
export const validateUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name should be at least 3 characters",
      "string.max": "Name should be at most 30 characters",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password should be at least 6 characters",
    }),
});
