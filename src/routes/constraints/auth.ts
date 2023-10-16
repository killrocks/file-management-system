import { Joi } from 'express-validation';

const login = {
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

export default {
    login,
};
