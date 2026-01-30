const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path to store messages
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Helper to save message to file
const saveMessage = (data) => {
    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
        const fileContent = fs.readFileSync(MESSAGES_FILE);
        messages = JSON.parse(fileContent);
    }
    messages.push({
        ...data,
        id: Date.now(),
        date: new Date().toISOString()
    });
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
};

// API Routes
app.post('/api/contact', (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    // Basic validation
    if (!firstName || !email || !message) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    try {
        // Save to local JSON file
        saveMessage({ firstName, lastName, email, subject, message });

        // Note: In a real production environment, you would use Nodemailer here 
        // to send an actual email.

        res.status(200).json({ success: 'Message received! We will get back to you soon.' });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
