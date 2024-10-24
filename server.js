import express from 'express';
import { S3Client, PutObjectCommand , GetObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import path from 'path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; 
import dotenv from 'dotenv'
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
// AWS S3 configuration
const s3Client = new S3Client({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
    
});

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

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'File is required' });
    }

    const file = req.file;
    const bucketName = process.env.BUCKET_NAME;
    const s3Key = `${Date.now()}_${file.originalname}`;

    const uploadParams = {
        Bucket: bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        // Upload the file to S3
        await s3Client.send(new PutObjectCommand(uploadParams));

        // Generate a signed URL for downloading
        const downloadURL = await getSignedUrl(
            s3Client,
            new GetObjectCommand({ Bucket: bucketName, Key: s3Key }),
            { expiresIn: 3600 } // URL expires in 1 hour
        );

        res.send({
            message: 'File uploaded successfully',
            downloadURL: downloadURL
        });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send({ error: 'Error uploading file' });
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send({ message: 'Welcome' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});