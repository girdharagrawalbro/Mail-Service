const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;

function getTransporter() {
    if (!transporter) {
        const host = process.env.EMAIL_HOST?.trim() || 'smtp.gmail.com';
        const port = Number(process.env.EMAIL_PORT || 587);
        const secure = process.env.EMAIL_SECURE
            ? process.env.EMAIL_SECURE === 'true'
            : port === 465;

        transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || undefined,
            host,
            port,
            secure,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            pool: true,
            maxConnections: 3,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 5,
            family: process.env.EMAIL_FORCE_IPV4 === 'false' ? undefined : 4,
            connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT_MS || 20000),
            greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT_MS || 20000),
            socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT_MS || 30000),
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