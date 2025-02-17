import nodemailer from 'nodemailer';

export default async function sendEmailHandler(req, res) {
    const { name, email, subject, message } = req.body;
    console.log(req.body);

    // Configure transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        // Use a valid sender email address
        from: email,
        to: 'ahlawy555555@gmail.com',
        subject: `New Message: ${subject}`,
        text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
        html: `
      <h3>New Message from Contact Form</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: error.message || 'Error sending message' });
    }
}
