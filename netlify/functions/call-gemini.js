// File: netlify/functions/call-gemini.js

exports.handler = async function(event) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Get the API key from Netlify's environment variables
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
             return { statusCode: 500, body: 'API key is not set.' };
        }
        
        // The data sent from your frontend
        const requestBody = JSON.parse(event.body);

        // NEW CORRECTED LINE
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
        
        // Use the exact payload structure your original code was using
        const payload = requestBody.payload;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Gemini API Error:", errorBody);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Gemini API call failed: ${errorBody}` })
            };
        }

        const result = await response.json();

        // Send the successful response back to the frontend
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Or specify your Netlify URL for better security
            },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error("Serverless function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};