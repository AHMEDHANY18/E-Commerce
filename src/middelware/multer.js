import multer from 'multer';
import { nanoid } from 'nanoid';

export const validExtension = {
    image: ["image/png", "image/jpeg", "image/jpg"],
    pdf: ["application/pdf"],
    video: ["video/mp4", "video/mkv"],
}

export const multerhost = (validExtensions) => {
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, nanoid(5) + '-' + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (validExtensions.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type, only allowed types are ' + validExtensions.join(', ')), false);
        }
    };

    return multer({ storage, fileFilter });
};
