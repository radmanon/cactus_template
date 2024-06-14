const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Search route to fetch data from Hugging Face API
app.get('/search', async (req, res) => {
    const query = req.query.q;
    const apiKey = process.env.HUGGING_FACE_API_KEY; // Get API key from environment variables

    console.log(`Using API Key: ${apiKey}`);

    try {
        const response = await axios.post('https://api-inference.huggingface.co/models/gpt2', {
            inputs: `Search result for "${query}":`,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const searchResult = response.data[0].generated_text.trim();
        res.json({ results: [{ name: query, description: searchResult, image: '/imgs/default.png' }] });
    } catch (error) {
        console.error('Error fetching data from Hugging Face:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
