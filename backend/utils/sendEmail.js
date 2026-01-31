const nodemailer = require('nodemailer');
const Setting = require('../models/Setting');

const sendEmail = async (options) => {
    // 1. Fetch SMTP Settings from DB
    const settings = await Setting.findOne({ type: 'general' });

    if (!settings || !settings.emailSettings || !settings.emailSettings.host) {
        throw new Error('SMTP settings are not configured. Please go to Settings > SMTP.');
    }

    const { host, port, user, pass, secure, fromEmail, fromName } = settings.emailSettings;

    // 2. Create Transporter
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure, // true for 465, false for other ports
        auth: {
            user,
            pass
        }
    });

    // 3. Define Email Options
    const mailOptions = {
        from: `"${fromName || 'CRM System'}" <${fromEmail || user}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
