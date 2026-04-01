const { GoogleGenAI } = require('@google/genai');
const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

// Initialize the GoogleGenAI client
// Requires GEMINI_API_KEY in the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports.getRecommendations = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    try {
        // Reverse geocode the user's location to get a readable address context
        // If reverse geocoding fails, we'll fall back to just using the coordinates.
        let addressContext = `coordinates ${lat}, ${lng}`;
        try {
            const address = await mapService.getReverseGeocode(lat, lng);
            if (address) {
                addressContext = `the area of ${address} (coordinates: ${lat}, ${lng})`;
            }
        } catch (e) {
            console.log("Reverse geocode failed, using raw coordinates.");
        }

        const prompt = `You are a local travel guide. A user is currently located near ${addressContext}. 
Please recommend 3 to 5 popular places to visit, hangout, or eat nearby this location. 
Respond ONLY with a valid JSON array of objects. Do not include markdown codeblocks (\`\`\`json). Just the raw JSON.
Each object must have the following properties:
[
  {
    "name": "Name of the place",
    "description": "A short 1-2 sentence description of why it's great",
  }
]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                // Ensure the model knows we want a JSON formatted string out, even though we are parsing manually.
                responseMimeType: "application/json",
            }
        });

        const textResponse = response.text;
        
        let recommendations;
        try {
            recommendations = JSON.parse(textResponse);
        } catch (parseErr) {
            // If the model wrapped it in markdown codeblocks anyway
            const cleanedText = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            recommendations = JSON.parse(cleanedText);
        }

        res.status(200).json(recommendations);
    } catch (err) {
        console.error("Error fetching AI recommendations:", err.message);
        // Fallback or send error properly
        res.status(500).json({ message: "Unable to fetch AI recommendations. Ensure GEMINI_API_KEY is set." });
    }
};
