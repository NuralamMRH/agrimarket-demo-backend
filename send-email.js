// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Log environment variables to verify
console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS}`);
console.log(`RECIPIENT_EMAIL: ${process.env.RECIPIENT_EMAIL}`);

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());

app.post("/api/send-email", async (req, res) => {
  const { name, company, phoneNumber, email, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail", // Use the appropriate service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: `Message from ${name}`,
    text: `Name: ${name}\nCompany: ${company}\nPhone Number: ${phoneNumber}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${process.env.RECIPIENT_EMAIL}`);
    res.status(200).json({ message: "Email sent successfully", email });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ error: "Failed to send email", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
