import fs from 'fs';
import config from 'config';

const removeFile = async (path: string) => new Promise<void>((res, rej) => {
    const fileName = path.substring(path.lastIndexOf('/') + 1);

    const filePath = `${config.fileUploadPath}/${fileName}`;

    fs.unlink(filePath, (err) => {
        if (fileName) {
            if (err) {
                if (!err.message.includes('no such file or directory')) {
                    // if it's not found, we just ignore the error for now.
                    rej(err);
                }
            }
        }
        res();
    });
});

export default {
    removeFile,
};
