import multer from 'multer';
import path from 'path';
// Multer configuration for file upload
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|mp4|mp3/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, MP4, and MP3 are allowed.'));
        }
    }
});

// Export the upload middleware
export default upload.single('file'); // 'file' is the field name for the file input
