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

// Search route to fetch data from Eden AI API
app.get('/search', async (req, res) => {
    const query = req.query.q;
    const apiKey = process.env.EDENAI_API_KEY; // Get API key from environment variables

    console.log(`Using API Key: ${apiKey}`);

    try {
        const response = await axios.post('https://api.edenai.run/v2/text/generation', {
            providers: "openai",
            text: `Please provide information about "${query}":`,
            temperature: 0.7,
            max_tokens: 256
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Eden AI Response:', response.data);

        // Check if the response contains results
        if (response.data.openai && response.data.openai.status === 'success') {
            const searchResult = response.data.openai.generated_text.trim();
            res.json({ result: searchResult });
        } else {
            res.json({ result: 'No results found in response' });
        }
    } catch (error) {
        console.error('Error fetching data from Eden AI:', error.response ? error.response.data : error.message);
        res.json({ result: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
