const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.post("/",async (req, res) => {
    try{
        console.log("Received POST:", req.body);
        const note = new Note({content: req.body.content});
        const saved = await note.save();
        res.status(201).json(saved);
    }catch (err){
        console.error("Save error:", err);
        res.status(500).json({error: 'failed to save note'});
    }
});

router.get("/",async (req, res) => {
    try{
        const notes = await Note.find().sort({updatedAt: -1});
        res.json(notes);

    }catch(err){
        console.error("Fetch error:", err);
        res.status(500).json({error: "Failed to Fetch notes"});
    }
});

module.exports = router;