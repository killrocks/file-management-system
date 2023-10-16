import { Joi } from 'express-validation';

const createMaintenance = ({
    body: Joi.object().keys({
        standard: Joi.string().required(),
        date: Joi.date().required(),
        customerName: Joi.string().required(),
        invoiceDate: Joi.string().required(),
        mrmDate: Joi.string().required(),
        docDate: Joi.string().required(),
        auditDate: Joi.string().required(),
        remarks: Joi.string().optional(),
    }),
});

const editMaintenance = ({
    body: Joi.object().keys({
        id: Joi.string().required(),
        standard: Joi.string().required(),
        customerName: Joi.string().required(),
        invoiceDate: Joi.string().required(),
        auditDate: Joi.string().required(),
        mrmDate: Joi.string().required(),
        docDate: Joi.string().required(),
        date: Joi.string().required(),
        remarks: Joi.string().optional(),
    }),
});

const deleteMaintenance = ({
    params: Joi.object({
        id: Joi.string().required(),
    }),
});

export default {
    createMaintenance,
    editMaintenance,
    deleteMaintenance,
};
