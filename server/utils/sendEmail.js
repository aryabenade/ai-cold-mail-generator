const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {

  try{
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials are not set in environment variables');
    }

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: `<p>${options.text}</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to} with subject: ${options.subject}`);
  }catch(error) {
    console.error(`Error sending email to ${options.to}:`, error);
    throw error;
  }
};

module.exports = sendEmail;