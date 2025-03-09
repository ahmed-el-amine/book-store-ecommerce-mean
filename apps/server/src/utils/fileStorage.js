import multer from 'multer';
import path from 'node:path';
import sanitize from 'sanitize-filename';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/covers/');
    },
    filename: function (req, file, cb) {
        const cleanName = sanitize(file.originalname);
        const ext = path.extname(cleanName);
        const base = path.basename(cleanName, ext);
        const fileSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${fileSuffix}${ext}`);
    }
});

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
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export default upload;