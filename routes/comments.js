const express = require("express");
const Comment = require("../models/comment.model"); 
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();


//Fetch a specific comment
router.get("/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment)
      return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comment" });
  }
});

//Add a comment to a specific thread (authentication required)
router.post('/threads/:threadId', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    const comment = new Comment({
      content,
      thread: thread._id,
      author: req.userId, 
    });
    await comment.save();

    thread.comments.push(comment._id);
    await thread.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

//Update a specific comment (authentication required)
router.put("/:commentId",authMiddleware,async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment)
        return res.status(404).json({ error: "Comment not found" });

      if (comment.author.toString() !==req.user.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const updatedComment =
        await Comment.findByIdAndUpdate(req.params.commentId,req.body,{ new: true }
        );
      res.json(updatedComment);
    } catch (err) {
      res.status(500).json({error: "Failed to update comment",});
    }
  }
);

//Delete a specific comment (authentication required)
router.delete("/:commentId",authMiddleware,async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment)
        return res.status(404).json({ error: "Comment not found" });

      if (comment.author.toString() !==req.user.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await comment.remove();
      res.json({message: "Comment deleted successfully",});
    } catch (err) {
      res.status(500).json({error: "Failed to delete comment",});
    }
  }
);

module.exports = router;
