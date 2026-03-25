const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            pool: true,
            maxConnections: 3,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 5,
        });
    }
    return transporter;
}

router.get('/health', (req, res) => {
    res.json({ success: true, service: 'mail', status: 'ok' });
});

router.post('/send', async (req, res) => {
    try {
        const { to, subject, html, text, fromName = 'Social Square', fromEmail } = req.body || {};

        if (!to || !subject || (!html && !text)) {
            return res.status(400).json({
                success: false,
                message: 'to, subject, and html or text are required',
            });
        }

        const sender = fromEmail || process.env.EMAIL_USER;
        if (!sender) {
            return res.status(500).json({
                success: false,
                message: 'EMAIL_USER is not configured on mail service',
            });
        }

        const info = await getTransporter().sendMail({
            from: `"${fromName}" <${sender}>`,
            to,
            subject,
            html,
            text,
        });

        return res.json({
            success: true,
            data: {
                messageId: info.messageId,
                accepted: info.accepted,
                rejected: info.rejected,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;