const express = require("express");
const { Post, Comment, User } = require("../models");
const auth = require("../middleware/auth");
const router = express.Router();

// list posts (with author and comment count)
router.get("/", async (req, res) => {
  const posts = await Post.findAll({
    include: [{ model: User, as: "author", attributes: ["id", "email", "name"] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(posts);
});

// create post (auth)
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "title & content required" });
  const post = await Post.create({ title, content, authorId: req.user.id });
  res.status(201).json(post);
});

// single post w/comments and authors
router.get("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: [
      { model: User, as: "author", attributes: ["id", "email", "name"] },
      { model: Comment, include: [{ model: User, as: "author", attributes: ["id", "email", "name"] }] }
    ]
  });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

// update post (author only)
router.put("/:id", auth, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  if (post.authorId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  const { title, content } = req.body;
  await post.update({ title: title ?? post.title, content: content ?? post.content });
  res.json(post);
});

// delete post (author only)
router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  if (post.authorId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  await post.destroy();
  res.json({ ok: true });
});

// list comments for a post
router.get("/:postId/comments", async (req, res) => {
  const comments = await Comment.findAll({
    where: { postId: req.params.postId },
    include: [{ model: User, as: "author", attributes: ["id", "email", "name"] }],
    order: [["createdAt", "ASC"]],
  });
  res.json(comments);
});

// create comment (auth)
router.post("/:postId/comments", auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "content required" });
  const post = await Post.findByPk(req.params.postId);
  if (!post) return res.status(404).json({ error: "Post not found" });
  const comment = await Comment.create({ content, postId: post.id, authorId: req.user.id });
  res.status(201).json(comment);
});

module.exports = router;
