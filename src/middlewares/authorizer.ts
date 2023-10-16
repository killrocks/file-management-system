import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import config from '~config';
import ApiError from '~lib/errorTypes/ApiError';

declare module 'jsonwebtoken' {
    export interface JwtPayload {
        id: string;
    }
}

const authorize = () => async (req: Request, res: Response, next: NextFunction) => new Promise((resolve, reject) => {
    const { authorization } = req.headers;

    if (!authorization) {
        reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
        return;
    }

    const tokenParts = authorization.split(' ');
    const token = tokenParts[1];

    if (tokenParts[0].toLowerCase() !== 'bearer' || !token) {
        // there is no auth token
        reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
    }

    try {
        const response = <jwt.JwtPayload>jwt.verify(token, config.jwtKey);

        const { exp } = response;

        if (!exp) {
            reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
            return;
        }

        const timeNow = Math.round((new Date()).getTime() / 1000);

        if (timeNow > exp) {
            reject(new ApiError(httpStatus.UNAUTHORIZED, 'Token expired'));
            return;
        }

        resolve(null);
    } catch (error) {
        if (error instanceof Error) {
            reject(new ApiError(httpStatus.UNAUTHORIZED, error.message));
        }

        reject(error);
    }
})
    .then(() => next())
    .catch((err) => next(err));

export default authorize;
