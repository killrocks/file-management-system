import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) });

const encodedDbPassword = encodeURIComponent(process.env.DB_PWD || '');

export default {
    env: process.env.ENV,
    port: process.env.PORT,

    host: process.env.HOST,

    mongoUrl: `mongodb://${process.env.DB_USER}:${encodedDbPassword}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    mongoHost: process.env.DB_HOST,

    jwtKey: process.env.JWT_TOKEN_KEY as string,
    jwtExpiry: 86400,

    fileUploadPath: 'public/uploads/',

};
