import multer from 'multer';
import path from 'node:path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Invalid file type. Only images are allowed.'), false);
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    if (!allowedExtensions.includes(ext)) {
        return cb(new Error('Invalid file extension. Allowed: .jpg, .jpeg, .png, .gif'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024
    }
});

export default upload;