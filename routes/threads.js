const express = require("express");
const router = express.Router();
const Thread = require("../models/thread.model");
const Comment = require("../models/comment.model");
const authMiddleware = require("../middlewares/authMiddleware");

// Get all threads
router.get("/", async (req, res) => {
  try {
    const threads = await Thread.find();
    res.json(threads);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch threads" });
  }
});

// Get a single thread by ID with comments
router.get("/:threadId", async (req, res) => {
  try {
    const thread = await Thread.findById(
      req.params.threadId
    ).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username",
      },
    });
    if (!thread)
      return res
        .status(404)
        .json({ error: "Thread not found" });
    res.json(thread);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch thread" });
  }
});

// Create a new thread
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    const { title, content } = req.body;

    try {
      const thread = new Thread({
        title,
        content,
        author: req.user.userId,
      });
      await thread.save();
      res.status(201).json(thread);
    } catch (err) {
      res
        .status(500)
        .json({
          error: "Failed to create thread",
        });
    }
  }
);

// Update a thread
router.put(
  "/:threadId",
  authMiddleware,
  async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.threadId);
      if (!thread)
        return res.status(404).json({ error: "Thread not found" });

      if (thread.author.toString() !==req.user.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const updatedThread = await Thread.findByIdAndUpdate(req.params.threadId,req.body,{ new: true });
      res.json(updatedThread);
    } catch (err) {
      res.status(500).json({error: "Failed to update thread",});
    }
  }
);

// Delete a thread
router.delete(
  "/:threadId",
  authMiddleware,
  async (req, res) => {
    try {
      const thread = await Thread.findById(
        req.params.threadId
      );
      if (!thread)
        return res
          .status(404)
          .json({ error: "Thread not found" });

      if (
        thread.author.toString() !==
        req.user.userId
      ) {
        return res
          .status(403)
          .json({ error: "Access denied" });
      }

      await thread.remove();
      res.json({
        message: "Thread deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to delete thread",
      });
    }
  }
);

module.exports = router;
