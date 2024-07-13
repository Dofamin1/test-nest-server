import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';

export const multerConfig: MulterOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
            return cb(new Error('Only .xlsx files are allowed!'), false);
        }
        cb(null, true);
    },
};
