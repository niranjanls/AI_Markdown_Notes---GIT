const express = require("express");
const router = express.Router();

const HUGGINGFACE_API_TOKEN = process.env.HF_API_KEY;

router.post("/", async (req, res) => {
    console.log("✅ Reached /api/ai (HuggingFace)");

    const { content } = req.body;

    if (!content || content.trim() === "") {
        return res.status(400).json({ error: "No content to summarize" });
    }

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: content })
        });

        const data = await response.json();

        if (data.error) {
            console.error("API error:", data.error);
            return res.status(500).json({ error: data.error });
        }

        const summary = data[0]?.summary_text || "Could not summarize";
        res.json({ summary });
    } catch (err) {
        console.error("HuggingFace summarization error:", err.message);
        res.status(500).json({ error: "Failed to summarize." });
    }
});

module.exports = router;