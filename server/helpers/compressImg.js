import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import mime from 'mime-types';

// Ensure directory exists for compressed images
const ensureDirExists = async (dirPath) => {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
        console.error("Error creating directory:", error.message);
        throw new Error("Failed to create directory.");
    }
};

// Compress image function
const compressImage = async (filePath) => {
    if (!filePath) throw new Error("No file path provided for compression");

    const mimeType = mime.lookup(filePath);
    if (mimeType !== 'image/jpeg') {
        throw new Error('File is not a valid JPEG image');
    }

    // Get the current filename and directory
    const __filename = fileURLToPath(import.meta.url);  // Convert ES module URL to file path
    const __dirname = path.dirname(__filename);  // Get directory name from the file path

    // Construct the path for the compressed file
    const fileName = path.basename(filePath);
    const compressedDir = path.join(__dirname, '..', 'uploads', 'compressed'); // Compressed directory path

    // Ensure the directory exists
    await ensureDirExists(compressedDir);

    // Path for the compressed image
    const compressedFilePath = path.join(compressedDir, fileName);

    try {
        // Compress the image
        await sharp(filePath)
            .toFormat('jpeg')
            .jpeg({ quality: 30 })
            .toFile(compressedFilePath);

        return compressedFilePath;
    } catch (error) {
        console.error('Error compressing image:', error.message);
        throw new Error('Image compression failed.');
    }
};


export {compressImage}