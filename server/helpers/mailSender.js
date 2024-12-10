import emailjs from 'emailjs-com'
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
import { createUserObject } from '../controllers/UserController.js';
dotenv.config();
emailjs.init(process.env.EMAILJS_KEY);

async function sendMail(req, res, next) {
    const { id, email, token } = req.userData;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email service (e.g., Outlook, Yahoo)
      auth: {
        user: 'maxvanholl75@gmail.com', // Your email address
        pass: 'xnlu xmfm xpjl ozcm', // Your email password or app-specific password
      },
    });
  
    const mailOptions = {
      from: '"MovieZone" <maxvanholl75@gmail.com>', // Sender's name and email
      to: email,
      subject: 'Confirm your email ✔',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: rgb(27, 27, 27); color: #FFA500; text-align: center;">
            <h2 style="color: #FFA500;">Welcome to MovieZone!</h2>
            <p style="font-size: 16px; color: #FFA500;">Please, use the following code to confirm your email:</p>
            <div style="font-size: 18px; font-weight: bold; color: #2c3e50; background: #f4f4f4; padding: 10px; border: 1px solid #ddd; border-radius: 4px; display: inline-block; margin: 20px auto;">
                <b>${token}${id}</b>
            </div>
            <p style="font-size: 12px; color: #888;">© MovieZone 2024. All rights reserved.</p>
        </div>
    `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('data after sending the email')
      console.log(req.userData)
      const tokenForBack = `${token}${id}`
      req.userData = createUserObject(
        req.userData.id,
        req.userData.firstname,
        req.userData.familyname,
        req.userData.email,
        tokenForBack
      );
      // Return the user data to the frontend
      return res.status(200).json(req.userData);
    } catch (error) {
      console.log('Failed to send email:', error);
      return next(error);
    }
  }
  

export {sendMail}