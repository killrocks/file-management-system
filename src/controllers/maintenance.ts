import { Request, Response } from 'express';

import { GetMaintenanceParams } from '~entities/Maintenance';
import MaintenanceService from '~services/maintenance';
import fs from '~lib/fs';
import servicesLib from '~lib/error';

import { ServiceResponseStatus } from '~services/types';
import { TypedRequestQueryParams } from '~entities/TypedRequest';
import { IErrorEnum } from '~entities/Error';

const createMaintenance = async (req: Request, res: Response) => {
    if (!req.files || !req.body) {
        res.status(400).send('Invalid Request');
    }

    const filenames = req.files! as {
        [fieldname: string]: Express.Multer.File[]
    };

    let proposalPath = '';
    let quotationPath = '';
    let quotationName = '';
    let proposalName = '';

    try {
        const { standard, customerName, invoiceDate, auditDate, mrmDate, docDate, date, remarks } = req.body;

        const { quotation, proposal } = filenames;

        if (quotation !== undefined) {
            quotationName = (quotation.map((file) => file.filename)).toString();
            quotationPath = (quotation.map((file) => file.path)).toString();
        }

        if (proposal !== undefined) {
            proposalName = (proposal.map((file) => file.filename)).toString();
            proposalPath = (proposal.map((file) => file.path)).toString();
        }

        const standardArr = standard.split(',');

        const invoiceDateNum = Number(invoiceDate);
        const auditDateNum = Number(auditDate);
        const mrmDateNum = Number(mrmDate);
        const docDateNum = Number(docDate);

        const response = await new MaintenanceService().CreateMaintenance(standardArr, customerName, invoiceDateNum, auditDateNum, mrmDateNum, docDateNum, proposalName, quotationName, date, remarks);

        if (response.status === ServiceResponseStatus.Success) {
            res.send(response.data);
        } else {
            fs.removeFile(proposalPath);
            fs.removeFile(quotationPath);
            res.status(400).send(response.data);
        }
    } catch (err) {
        fs.removeFile(proposalPath);
        fs.removeFile(quotationPath);
        console.log(err);
        res.status(400).send(servicesLib.generateServiceError(IErrorEnum.UnknownError, 'Something went wrong'));
    }
};

const GetMaintenance = async (req: TypedRequestQueryParams<GetMaintenanceParams>, res: Response) => {
    const { index, search, dateFilter, invoice, audit, mrm, doc } = req.query;

    const response = await new MaintenanceService().GetMaintenance(Number(index), search, dateFilter, Number(invoice), Number(audit), Number(mrm), Number(doc));

    if (response.status === ServiceResponseStatus.Success) {
        res.send(response.data);
    } else {
        res.status(400).send(response.data);
    }
};

const editMaintenance = async (req: Request, res: Response) => {
    const filenames = req.files! as {
        [fieldname: string]: Express.Multer.File[]
    };
    let proposalPath = '';
    let quotationPath = '';
    let quotationName = '';
    let proposalName = '';

    try {
        const { quotation, proposal } = filenames;

        if (quotation !== undefined) {
            quotationName = (quotation.map((file) => file.filename)).toString();
            quotationPath = (quotation.map((file) => file.path)).toString();
        }

        if (proposal !== undefined) {
            proposalName = (proposal.map((file) => file.filename)).toString();
            proposalPath = (proposal.map((file) => file.path)).toString();
        }

        const { id, standard, customerName, invoiceDate, auditDate, mrmDate, docDate, date, remarks } = req.body;

        const standardArr = standard.split(',');

        const invoiceDateNum = Number(invoiceDate);
        const auditDateNum = Number(auditDate);
        const mrmDateNum = Number(mrmDate);
        const docDateNum = Number(docDate);

        const response = await new MaintenanceService().EditMaintenance(id, standardArr, customerName, invoiceDateNum, auditDateNum, mrmDateNum, docDateNum, proposalName, quotationName, date, remarks);

        if (response.status === ServiceResponseStatus.Success) {
            res.send(response.data);
        } else {
            fs.removeFile(proposalPath);
            fs.removeFile(quotationPath);
            res.status(400).send(response.data);
        }
    } catch (err) {
        fs.removeFile(proposalPath);
        fs.removeFile(quotationPath);
        res.status(400).send(servicesLib.generateServiceError(IErrorEnum.UnknownError, 'Something went wrong'));
    }
};

const deleteMaintenance = async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await new MaintenanceService().DeleteMaintenance(id);

    if (response.status === ServiceResponseStatus.Success) {
        res.send(response.data);
    } else {
        res.status(400).send(response.data);
    }
};

export default {
    createMaintenance,
    GetMaintenance,
    editMaintenance,
    deleteMaintenance,
};
