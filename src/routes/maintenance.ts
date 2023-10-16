import express from 'express';

import { validate } from 'express-validation';
import upload from '~middlewares/multer';
import authorize from '~middlewares/authorizer';
import maintenance from '~controllers/maintenance';
import constraints from '~routes/constraints/maintenance';

const router = express.Router();

router.post('/', authorize(), upload.fields([
    { name: 'proposal', maxCount: 1 },
    { name: 'quotation', maxCount: 1 },
]), validate(constraints.createMaintenance), maintenance.createMaintenance);

router.get('/', authorize(), maintenance.GetMaintenance);

router.put('/', authorize(), upload.fields([
    { name: 'proposal', maxCount: 1 },
    { name: 'quotation', maxCount: 1 },
]), validate(constraints.editMaintenance), maintenance.editMaintenance);

router.delete('/:id', authorize(), validate(constraints.deleteMaintenance), maintenance.deleteMaintenance);

export default router;
