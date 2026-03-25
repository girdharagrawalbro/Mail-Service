require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.MAIL_SERVICE_PORT || 5002);

const rawCorsOrigins = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '*';
const allowedOrigins = rawCorsOrigins
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
const allowAllOrigins = allowedOrigins.includes('*');

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

const mailRoutes = require('./routes/mail.routes');

app.use('/api/mail', mailRoutes);


app.listen(PORT, () => {
    console.log(`[Mail Service] running on http://localhost:${PORT}`);
});
