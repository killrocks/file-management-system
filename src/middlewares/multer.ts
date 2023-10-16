import multer from 'multer';
import config from 'config';
import path from 'path';

const fileStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, `${config.fileUploadPath}`);
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

export default multer({
    storage: fileStorage,
    fileFilter(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
            return cb(new Error('Only images allowed!'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 3 * 1000 * 1000,
    },
});
