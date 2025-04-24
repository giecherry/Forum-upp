const express = require("express");
const router = express.Router();
const Thread = require("../models/thread.model");
const Comment = require("../models/comment.model");
const authMiddleware = require("../middlewares/authMiddleware");
const {validateObjectId} = require("./users");

// Get all threads
router.get("/", async (req, res) => {
  try { 
    console.log("Fetching threads...");   
    const threads = await Thread.find();
    if (!threads) {
      console.log("No threads found");
      return res.status(404).json({ error: "No threads found" });
    }
    res.json(threads);
    console.log("Threads fetched successfully");
  } catch (err) {
    console.error("Error fetching threads:", err);
    res.status(500).json({ message: "Failed to fetch threads" });
  }
});

// Get a single thread by ID with comments
router.get("/:threadId", validateObjectId('threadId'),  async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username",
      },
    });
    if (!thread)
      return res.status(404).json({ error: "Thread not found" });
    res.json(thread);
    console.log("Thread fetched successfully");
  } catch (err) {
    console.error("Error fetching thread");
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// Create a new thread
router.post("/",authMiddleware, async (req, res) => {
    try {
      const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required",
      });
    }

    if (title.length < 5 || title.length > 100) {
      return res.status(400).json({
        error: "Title must be between 5 and 100 characters",
      });
    }
    if (content.length < 10 || content.length > 1000) {
      return res.status(400).json({
        error: "Content must be between 10 and 1000 characters",
      });
    }

    const newThread = {
        title: req.body.title,
        content: req.body.content,
        author: req.user.userId,
    };
    
    const thread = await Thread.create(newThread)
    res.status(201).json(thread);
    console.log("Thread created successfully");
    } catch (err) {
      console.error("Error creating thread");
      res.status(500).json({error: "Failed to create thread",});
    }
  }
);

// Update a thread
router.put("/:threadId",authMiddleware , validateObjectId('threadId'),async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({error: "Title and content are required",});
      }

      const thread = await Thread.findById(req.params.threadId);
      if (!thread)
        return res.status(404).json({ error: "Thread not found" });

      if (thread.author.toString() !==req.user.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (title === thread.title && content === thread.content) {
        return res.status(400).json({ error: "No changes detected" });
      }

      if (content && (content.length < 10 || content.length > 1000)) {
        return res.status(400).json({ error: "Content must be between 10 and 1000 characters" });
      }
      if (title && (title.length < 5 || title.length > 100)) {
        return res.status(400).json({ error: "Title must be between 5 and 100 characters" });
      }

      if (title) thread.title = title;
      if (content) thread.content = content;
      await thread.save();

      res.json({ message: "Thread updated successfully", thread });
      console.log("Thread updated successfully");
    } catch (err) {
      res.status(500).json({error: "Failed to update thread",});
      console.error("Error updating thread");
    }
  }
);


// Delete a thread
router.delete("/:threadId",authMiddleware, validateObjectId('threadId'), async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.threadId);
      if (!thread){
        console.log(`Thread with ID ${req.params.threadId} not found`);
        return res.status(404).json({ error: "Thread not found" });
      }
      if (thread.author.toString() !==req.user.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await thread.remove();
      res.json({message: "Thread deleted successfully",});
      console.log(`Thread with ID ${req.params.threadId} deleted successfully`);
    } catch (err) {
      console.error(`Error deleting thread with ID ${req.params.threadId}`);
      res.status(500).json({error: "Failed to delete thread",});
    }
  }
);

module.exports = router;
