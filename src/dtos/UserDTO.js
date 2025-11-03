const Joi = require('joi');

const UserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'O campo email é obrigatório.',
      'string.email': 'Formato de email inválido.'
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'O campo senha é obrigatório.',
      'string.min': 'A senha deve ter pelo menos 6 caracteres.'
    })
});

module.exports = { UserSchema };
