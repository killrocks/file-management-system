import express from 'express';

import auth from '~routes/auth';
import project from '~routes/project';
import maintenance from '~routes/maintenance';

const router = express.Router();

const routes = [{
    path: '/auth',
    route: auth,
}, {
    path: '/projects',
    route: project,
}, {
    path: '/maintenance',
    route: maintenance,
}];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

router.get('/hello', (req, res) => {
    res.send(process.env.npm_package_version);
});

export default router;
