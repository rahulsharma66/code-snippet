// server/routes/snippets.js
const router = require('express').Router();
const Snippet = require('../models/Snippet');

// 1. CREATE A NEW SNIPPET
router.post('/', async (req, res) => {
  const newSnippet = new Snippet(req.body);
  try {
    const savedSnippet = await newSnippet.save();
    res.status(200).json(savedSnippet);
  } catch (err) {
    res.status(500).json(err);
  }
});

// --- NEW ROUTES FOR PHASE 2 ---

// GET ALL PUBLIC SNIPPETS (Discovery Feed)
// NOTE: This must be placed BEFORE the /:userId route
// server/routes/snippets.js

// GET PUBLIC SNIPPETS (Infinite Scroll)
router.get("/explore", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6; // Number of projects to load per scroll
  const skip = (page - 1) * limit;

  try {
    const snippets = await Snippet.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      // .populate('owner', 'username'); // Uncomment this if you updated your User Schema relation

    res.status(200).json(snippets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching public projects", error: err });
  }
});

// FORK A PROJECT
router.post("/fork/:id", async (req, res) => {
  try {
    const { newUserId } = req.body; // The ID of the user who is forking
    
    // 1. Find the original snippet
    const originalSnippet = await Snippet.findById(req.params.id);
    if (!originalSnippet) return res.status(404).json("Project not found");

    // 2. Create the copy
    const forkedSnippet = new Snippet({
      userId: newUserId,
      title: `${originalSnippet.title} (Forked)`,
      files: originalSnippet.files, // Copies the entire array of code
      isPublic: false, // Forked projects start as private by default
      isForked: true,
      parentSnippetId: originalSnippet._id
    });

    const savedSnippet = await forkedSnippet.save();
    res.status(201).json(savedSnippet);
  } catch (err) {
    res.status(500).json({ message: "Forking failed", error: err });
  }
});

// -----------------------------

// 3. GET ONE SPECIFIC SNIPPET
router.get('/find/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    res.status(200).json(snippet);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET ALL SNIPPETS (For a specific user)
// Example URL: http://localhost:8800/api/snippets/12345
router.get('/:userId', async (req, res) => {
  try {
    const snippets = await Snippet.find({ userId: req.params.userId });
    res.status(200).json(snippets);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE A SNIPPET
router.put('/:id', async (req, res) => {
  try {
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, 
      { new: true }
    );
    res.status(200).json(updatedSnippet);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE A SNIPPET
router.delete('/:id', async (req, res) => {
  try {
    await Snippet.findByIdAndDelete(req.params.id);
    res.status(200).json("Snippet has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;