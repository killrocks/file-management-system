import { IAuthUser } from 'entities/AuthUser';
import AuthUser from 'models/AuthUser';
import { LeanDocument } from 'mongoose';
import servicesLib from 'lib/error';
import { IErrorEnum } from 'entities/Error';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import { ServiceResponse, ServiceResponseStatus } from './types';

export default class AuthService {
    async Login(username: string, password: string): ServiceResponse<string> {
        const response: LeanDocument<IAuthUser> = await AuthUser.findOne({ username }).lean().exec();
        if (!response) {
            return servicesLib.generateServiceError(IErrorEnum.AuthLoginNotFound, 'User not found')
        }

        const { password: passwordInDb, _id: userId } = response;

        const validatePassword = await bcrypt.compare(password, passwordInDb);

        if (!validatePassword) {
            return servicesLib.generateServiceError(IErrorEnum.AuthLoginInvalidPassword, 'Invalid Credentials');
        }

        const claims = {
            id: userId,
            exp: Math.floor(Date.now() / 1000) + config.jwtExpiry,
        };
        const newToken = jwt.sign(claims, config.jwtKey);

        return {
            status: ServiceResponseStatus.Success,
            data: {
                token: newToken,
            },
        };
    }
}
