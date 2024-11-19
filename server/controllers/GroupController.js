import { postGroup } from "../models/Group.js";
import { ApiError } from "../helpers/errorClass.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Ensure the uploads folder exists and handle the file path
async function postNewGroup(req, res, next) {
    try {
        if(!req.body.adm_mail || req.body.adm_mail.length === 0) return next(new ApiError('Invalid admin email for group', 400));
        if(!req.body.g_name || req.body.g_name.length === 0) return next(new ApiError('Invalid group name for group', 400));
        if(!req.body.description || req.body.description.length === 0) return next(new ApiError('Invalid description for group', 400));
        
        let photoPath = null;
        if (req.body.photo) {
            const base64Data = req.body.photo.replace(/^data:image\/\w+;base64,/, ""); // Strip metadata
            const buffer = Buffer.from(base64Data, "base64");
    
            // Get current directory from import.meta.url
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename); // Derive __dirname from the current file URL
    
            // Specify the absolute path to the uploads folder (relative to project root)
            const uploadsDir = path.join(__dirname, '..', 'uploads');  //points to the correct location

            // Debugging the path
            console.log("Uploads directory: ", uploadsDir);
    
            // Create the uploads directory if it doesn't exist
            if (!fs.existsSync(uploadsDir)) {
                console.log("Creating uploads directory...");
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            // Generate a unique file name
            const fileName = `${Date.now()}-${req.body.g_name}.png`;
            photoPath = path.join(uploadsDir, fileName);

            // Save the image to the server
            try {
                fs.writeFileSync(photoPath, buffer);
                console.log("File saved: ", photoPath);  // Log the path of the saved file
            } catch (err) {
                console.error("Error saving file: ", err);
                return next(new ApiError("Error saving photo", 500));
            }

            // Convert the path to a relative URL for use in the database
            photoPath = `/uploads/${fileName}`;
        }

        const response = await postGroup(req.body.adm_mail, req.body.g_name, req.body.description, photoPath);  
        if (response.rowCount > 0) {
            return res.status(200).json({state: `group: ${req.body.g_name} has been created`});
        } else {
            return next(new ApiError('Group creation failed', 400));
        }
    } catch (error) {
        console.error("Error in postNewGroup: ", error);
        return next(error);
    }
}   

export { postNewGroup };
