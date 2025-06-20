import axios from "axios";

const API_KEY = "AIzaSyDRDFTU7HS-u1aXKeO_pwsMNWyHmZAuHQA";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

export async function getColorsFromGemini(keyword) {
    try {
        const prompt = `Generate a JSON array of 20 visually appealing and distinct hex color codes inspired by the theme "${keyword}". 
Only return a raw JSON array like ["#000000", "#ffffff", ...] with no markdown, no explanation, and no extra text.`;


        const response = await axios.post(`${GEMINI_URL}?key=${API_KEY}`, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
        });

        let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Clean response (remove ```json ... ```)
        raw = raw.replace(/```json|```/g, "").trim();

        console.log("Cleaned response:", raw);

        const colors = JSON.parse(raw);
        return Array.isArray(colors) ? colors : [];
    } catch (error) {
        console.error("Gemini API Error: ", error);
        return [];
    }
}
