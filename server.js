const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // To use environment variables for email credentials

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider's service (e.g., Gmail, Outlook, etc.)
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.PASSWORD, // Your email password (use an app-specific password if using Gmail)
    },
});

// Route to handle form submission
app.post('/submit-form', (req, res) => {
    const { name, phone, email, service, message } = req.body;

    // HTML email content for visually appealing format
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e2e2; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #f14144; text-align: center;">New Contact Form Submission</h2>
        <p style="color: #333; font-size: 16px;">You have received a new message from your contact form.</p>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7;"><strong>Name:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7;"><strong>Phone:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7;"><strong>Email:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7;"><strong>Service:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${service}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7;"><strong>Message:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
            </tr>
        </table>

         </div>
    `;

    // Email options
    const mailOptions = {
        from: process.env.EMAIL, // Sender address
        to: `${process.env.RECEIVER_EMAIL}, acrepairingservicegoa@gmail.com`, // Multiple recipients
        subject: `New Contact Form Submission from ${name}`,
        html: htmlContent, // Use HTML format instead of plain text
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email.');
        } else {
            console.log('Email sent: ' + info.response);
            // Redirect the user to the thank you page upon successful submission
            res.redirect('https://repairingwalaa.in/thank-you/');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
