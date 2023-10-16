import { Request, Response } from 'express';
import { IErrorEnum } from '~entities/Error';
import { GetProjectParams } from '~entities/Project';
import { TypedRequestQueryParams } from '~entities/TypedRequest';
import fs from '~lib/fs';
import servicesLib from '~lib/error';
import ProjectService from '~services/project';

import { ServiceResponseStatus } from '~services/types';

const createProject = async (req: Request, res: Response) => {
    if (!req.files || !req.body) {
        res.status(400).send('Invalid request');
    }
    const filenames = req.files! as { [fieldname: string]: Express.Multer.File[] };
    let quotationPath = '';
    let proposalPath = '';
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

        const { date, standard, customerName, amount, remarks } = req.body;

        const standardArr = standard.split(',');
        const contractAmountInNumber = Number(amount);

        const response = await new ProjectService().CreateProject(quotationName, proposalName, date, customerName, contractAmountInNumber, standardArr, remarks);

        if (response.status === ServiceResponseStatus.Success) {
            res.send(response.data);
        } else {
            fs.removeFile(quotationPath);
            fs.removeFile(proposalPath);
            res.status(400).send(response.data);
        }
    } catch (err) {
        fs.removeFile(quotationPath);
        fs.removeFile(proposalPath);
        res.status(400).send(servicesLib.generateServiceError(IErrorEnum.UnknownError, 'Something went wrong'));
    }
};

const editProject = async (req: Request, res: Response) => {
    if (!req.files || !req.body) {
        res.status(400).send('Invalid Request');
    }

    const filenames = req.files! as { [fieldname: string]: Express.Multer.File[] };

    let quotationPath = '';
    let proposalPath = '';
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

        const { id, date, standard, customerName, amount, remarks } = req.body;
        const standardArr = standard.split(',');

        const contractAmountInNumber = Number(amount);
        const response = await new ProjectService().EditProject(id, proposalName, quotationName, date, standardArr, customerName, contractAmountInNumber, remarks);

        if (response.status === ServiceResponseStatus.Success) {
            res.send(response.data);
        } else {
            fs.removeFile(quotationPath);
            fs.removeFile(proposalPath);
            res.status(400).send(response.data);
        }
    } catch (err) {
        fs.removeFile(quotationPath);
        fs.removeFile(proposalPath);
        res.status(400).send(servicesLib.generateServiceError(IErrorEnum.UnknownError, 'Something went wrong'));
    }
};

const getProject = async (req: TypedRequestQueryParams<GetProjectParams>, res: Response) => {
    const { index, search, dateFilter } = req.query;
    const response = await new ProjectService().GetAllProjects(Number(index), search, dateFilter);

    if (response.status === ServiceResponseStatus.Success) {
        res.send(response.data);
    } else {
        res.status(400).send(response.data);
    }
};

const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await new ProjectService().DeleteProject(id);

    if (response.status === ServiceResponseStatus.Success) {
        res.send(response.data);
    } else { res.status(400).send(response.data); }
};

export default {
    createProject,
    editProject,
    getProject,
    deleteProject,
};
