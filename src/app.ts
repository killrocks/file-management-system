import 'module-alias/register';
import 'source-map-support/register';

import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import mongoose from 'mongoose';

import config from '~config';
import authLimiter from '~middlewares/rateLimiter';
import routes from '~routes';
import errorLib from '~lib/error';

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
    origin: '*',
}));

if (config.env === 'prod') {
    app.use('/', authLimiter);
}

app.use('/', routes);

app.use(express.static('public/'));
app.use(errorLib.expressErrorHandler);

mongoose.connect(config.mongoUrl, {
    family: 4,
    authSource: 'APF',
}).then(() => {
    console.log('Connected to MongoDB.', config.mongoHost);

    app.listen(config.port, () => {
        console.log(`Listening to port ${config.port}`);
    });
}).catch((err) => {
    console.log('Unable to connect to MongoDB.', config.mongoHost, err);
});
