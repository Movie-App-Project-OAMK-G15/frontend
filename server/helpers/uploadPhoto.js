import axios from 'axios';
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();

const uploadToImgBB = async (filePath) => {
    try {
        const imageData = fs.readFileSync(filePath); // Read the image file
        const base64Image = imageData.toString('base64');
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            new URLSearchParams({ image: base64Image })
        );

        const imageUrl = response.data.data.url;

        // Clean up local file after successful upload
        fs.unlinkSync(filePath);
        return imageUrl;
    } catch (error) {
        console.error('Error uploading to ImgBB:', error.message);
        throw new Error('Failed to upload photo to ImgBB.');
    }
};

export {uploadToImgBB}