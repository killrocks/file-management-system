import express from 'express';
import { validate } from 'express-validation';

import constraints from '~routes/constraints/auth';
import auth from '~controllers/auth';

const router = express.Router();

router.post('/login', validate(constraints.login), auth.login);

export default router;
