const express = require("express");
const Comment = require("../models/comment.model"); 
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get('/threads/:threadId', async (req, res) => {
  try {
    const comments = await Comment.find({ thread: req.params.threadId }).populate('author', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.get("/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findById(
      req.params.commentId
    );
    if (!comment)
      return res
        .status(404)
        .json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch comment" });
  }
});

router.post('/threads/:threadId', authMiddleware, async (req, res) => {
  const { content } = req.body;

  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    const comment = new Comment({
      content,
      thread: thread._id,
      author: req.userId, // Attach the logged-in user as the author
    });
    await comment.save();

    thread.comments.push(comment._id);
    await thread.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

router.put(
  "/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const comment = await Comment.findById(
        req.params.commentId
      );
      if (!comment)
        return res
          .status(404)
          .json({ error: "Comment not found" });

      if (
        comment.author.toString() !==
        req.user.userId
      ) {
        return res
          .status(403)
          .json({ error: "Access denied" });
      }

      const updatedComment =
        await Comment.findByIdAndUpdate(
          req.params.commentId,
          req.body,
          { new: true }
        );
      res.json(updatedComment);
    } catch (err) {
      res
        .status(500)
        .json({
          error: "Failed to update comment",
        });
    }
  }
);

router.delete(
  "/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const comment = await Comment.findById(
        req.params.commentId
      );
      if (!comment)
        return res
          .status(404)
          .json({ error: "Comment not found" });

      if (
        comment.author.toString() !==
        req.user.userId
      ) {
        return res
          .status(403)
          .json({ error: "Access denied" });
      }

      await comment.remove();
      res.json({
        message: "Comment deleted successfully",
      });
    } catch (err) {
      res
        .status(500)
        .json({
          error: "Failed to delete comment",
        });
    }
  }
);

module.exports = router;
