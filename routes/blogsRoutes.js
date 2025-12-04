const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController'); 
const { verifyToken } = require('../controllers/authController');

// ============================================
// 1. CREATE ROUTES
// ============================================
router.get('/create', verifyToken, blogController.createBlogGet);
router.post('/create', verifyToken, blogController.createBlogPost);

// ============================================
// 2. EDIT & UPDATE BLOG ROUTES
// ============================================
router.get('/:id/edit', verifyToken, blogController.editBlogGet);
router.post('/:id/update', verifyToken, blogController.updateBlogPost);

// ============================================
// 3. INTERACTION ROUTES (Likes & New Comments)
// ============================================
router.post('/:id/like', verifyToken, blogController.toggleLike);
router.post('/:id/comment', verifyToken, blogController.postComment);

// ============================================
// 4. COMMENT MANAGEMENT ROUTES (✅ NEW)
// ============================================
// Get Edit Form
router.get('/:id/comments/:commentId/edit', verifyToken, blogController.editCommentGet);
// Update Comment
router.post('/:id/comments/:commentId/update', verifyToken, blogController.updateComment);
// Delete Comment
router.post('/:id/comments/:commentId/delete', verifyToken, blogController.deleteComment);

// ============================================
// 5. DELETE BLOG ROUTE
// ============================================
router.post('/:id/delete', verifyToken, blogController.deleteBlog);

// ============================================
// 6. VIEW ROUTES (Public)
// ============================================
router.get('/', blogController.allBlogs);
router.get('/:id', blogController.blogDetails);

module.exports = router;