import express from "express";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import upload from "../config/multerConfig.js";
import s3Client from "../config/awsConfig.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router = express.Router();

// Upload route
router.post("/upload", upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "File is required" });
  }

  const file = req.file;
  const bucketName = process.env.BUCKET_NAME;
  const s3Key = `${Date.now()}_${file.originalname}`;

  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    console.log(uploadParams, 'params')

    // Upload the file to S3
    await s3Client.send(new PutObjectCommand(uploadParams));
    // Generate a signed URL for downloading
    const downloadURL = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: bucketName, Key: s3Key }),
      { expiresIn: 74000 } 
    );
  
    res.send({
      message: "File uploaded successfully",
      downloadURL: downloadURL,
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send({ error: "Error uploading file" });
  }
});


export default router;
