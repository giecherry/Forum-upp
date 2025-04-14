const express = require("express");
const Comment = require("../models/comment.model"); 
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const {validateObjectId} = require("./users");

//Fetch a specific comment
router.get("/:commentId", validateObjectId('commentId'), async (req, res) => {
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
router.post('/threads/:threadId', authMiddleware, validateObjectId('commentId'), async (req, res) => {
  const { content } = req.body;
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    if (!content) return res.status(400).json({ error: 'Content is required' });
    if (content.length < 1 || content.length > 500) {
      return res.status(400).json({ error: 'Content must be between 1 and 500 characters' });
    }

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
router.put("/:commentId",authMiddleware, validateObjectId('commentId'),async (req, res) => {
    try {
      const { newContent } = req.body;
      const currentComment = await Comment.findById(req.params.commentId);
      if (!currentComment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (currentComment.author.toString() !== req.user.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!newContent)
        return res.status(400).json({ error: "Comment content required" });

      if (newContent === currentComment.content) {
        return res.status(400).json({ error: "No changes detected" });
      }

      if (newContent.length < 1 || newContent.length > 500) {
        return res.status(400).json({ error: "Content must be between 1 and 500 characters" });
      }

      currentComment.content = newContent;
      await currentComment.save();

      res.json(currentComment, { message: "Comment updated successfully" });
    } catch (err) {
      res.status(500).json({error: "Failed to update comment",});
    }
  }
);

//Delete a specific comment (authentication required)
router.delete("/:commentId",authMiddleware, validateObjectId('commentId'), async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment){
        console.log(`Comment with ID ${req.params.commentId} not found`);
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comment.author.toString() !==req.user.userId) {
        console.log(`User ${req.user.userId} is not the author of comment ${req.params.commentId}`);
        return res.status(403).json({ error: "Access denied" });
      }

      await comment.remove();
      console.log(`Comment with ID ${req.params.commentId} deleted successfully`);
      res.json({message: "Comment deleted successfully",});
    } catch (err) {
      console.error(`Error deleting comment with ID ${req.params.commentId}`)
      res.status(500).json({error: "Failed to delete comment",});
    }
  }
);

module.exports = router;
