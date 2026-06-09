
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;

// נקודת קצה לאימות ה-Webhook מול Meta (GET)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            console.log('Webhook verified successfully!');
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
});

// נקודת קצה לקבלת אירועים מ-Meta (POST)
app.post('/webhook', (req, res) => {
    const body = req.body;
    console.log('Received webhook event:', JSON.stringify(body, null, 2));

    res.status(200).send('EVENT_RECEIVED');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});