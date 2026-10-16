require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function sendReport() {
  const completeHtmlPath = path.join(__dirname, 'allure-report', 'complete.html');
  
  if (!fs.existsSync(completeHtmlPath)) {
    return console.log('❌ Error: No complete.html found. Please ensure allure and allure-single-html-file-js ran successfully.');
  }

  console.log('📦 Allure Report found! Sending email...');
  
  // 1. Setup your Email (Using Gmail App Password)
  let transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
    }
  });

  // 2. Send the Email
  await transporter.sendMail({
    from: `"QA Automation" <${process.env.EMAIL_USER}>`,
     to: "dhwani.parikh@mobmaxime.com,pratik.modi@mobmaxime.com", 
    subject: "✅ Latest QA Automation Test Results",
    text: "Hello! The latest tests have successfully passed. Please find the attached Single HTML Allure Report. You can download and open it directly in your browser to view all the steps, traces, and screenshots seamlessly!",
    attachments: [
      {
        filename: 'Allure-Report.html',
        path: completeHtmlPath
      }
    ]
  });
  
  console.log("📧 Email sent successfully with embedded Allure images!");
}

sendReport().catch(console.error);
