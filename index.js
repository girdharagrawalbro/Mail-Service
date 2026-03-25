require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.MAIL_SERVICE_PORT || 5002);

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const mailRoutes = require('./routes/mail.routes');

app.use('/api/mail', mailRoutes);


app.listen(PORT, () => {
    console.log(`[Mail Service] running on http://localhost:${PORT}`);
});
