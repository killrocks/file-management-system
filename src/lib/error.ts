import { ServiceResponseError, ServiceResponseStatus } from '~services/types';
import { IErrorEnum } from 'entities/Error';
import httpStatus from 'http-status';
import ApiError from './errorTypes/ApiError';
import { ValidationError } from 'express-validation';
import { NextFunction, Request, Response } from 'express';

const handleCatchServiceError = (error: any): ServiceResponseError => {
    let errorMessage = 'Something went wrong. Please try again.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return {
        status: ServiceResponseStatus.Error,
        data: {
            code: IErrorEnum.UnknownError,
            error: errorMessage,
        },
    };
};

const generateServiceError = (code: number, error: string): ServiceResponseError => ({
    status: ServiceResponseStatus.Error,
    data: {
        code,
        error,
    },
});

const expressErrorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        return res.status(400).send({
            code: IErrorEnum.ValidationError,
            error: 'Something went wrong. Please try again.',
        });
    }

    if (err instanceof ApiError) {
        if (err.statusCode === httpStatus.UNAUTHORIZED) return res.status(err.statusCode).send(err.message);
    }

    next(err);
};

export default {
    handleCatchServiceError,
    generateServiceError,

    expressErrorHandler,
};
