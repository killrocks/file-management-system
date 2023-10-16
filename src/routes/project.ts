import express from 'express';
import { validate } from 'express-validation';

import constraints from '~routes/constraints/project';
import upload from '~middlewares/multer';
import authorize from '~middlewares/authorizer';
import project from '~controllers/project';

const router = express.Router();

router.post('/', authorize(), upload.fields([
    { name: 'proposal', maxCount: 1 },
    { name: 'quotation', maxCount: 1 },
]), validate(constraints.createProject), project.createProject);

router.put('/', authorize(), upload.fields([
    { name: 'proposal', maxCount: 1 },
    { name: 'quotation', maxCount: 1 },
]), validate(constraints.editProject), project.editProject);

router.get('/', authorize(), project.getProject);

router.delete('/:id', authorize(), validate(constraints.deleteProject), project.deleteProject);

export default router;
