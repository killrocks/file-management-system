import { Request, Response } from 'express';

import AuthService from '~services/auth';
import { ServiceResponseStatus } from '~services/types';

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const response = await new AuthService().Login(username, password);

    if (response.status === ServiceResponseStatus.Success) {
        res.send(response.data);
    } else {
        res.status(400).send(response.data);
    }
};

export default {
    login,
};
