import { Joi } from 'express-validation';

const createProject = ({
    body: Joi.object().keys({
        date: Joi.date().required(),
        standard: Joi.string().required(),
        customerName: Joi.string().required(),
        amount: Joi.string().required(),
        remarks: Joi.string().optional(),
    }),
});

const editProject = ({
    body: Joi.object().keys({
        id: Joi.string().required(),
        date: Joi.string().required(),
        standard: Joi.string().required(),
        customerName: Joi.string().required(),
        amount: Joi.string().required(),
        remarks: Joi.string().optional(),
    }),
});

const deleteProject = ({
    params: Joi.object({
        id: Joi.string().required(),
    }),
});

export default {
    createProject,
    editProject,
    deleteProject,
};
