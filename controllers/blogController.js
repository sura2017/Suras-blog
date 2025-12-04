const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');

// 1. Get All Blogs
const allBlogs = (req, res) => {
    const searchQuery = req.query.search;
    let filter = {};
    if (searchQuery) {
        filter = { title: { $regex: searchQuery, $options: 'i' } };
    }

    Blog.find(filter).sort({ createdAt: -1 }).populate('author')
        .then((result) => {
            res.render('allBlogs', { title: 'All Blogs', blogs: result, searchQuery });
        })
        .catch((err) => console.log(err));
};

// 2. Get Create Form
const createBlogGet = (req, res) => {
    res.render('create', { title: 'Create a new Blog' });
};

// 3. Create Blog Post
const createBlogPost = (req, res) => {
    const blog = new Blog({ ...req.body, author: req.userId });
    blog.save()
        .then(() => res.redirect('/blogs'))
        .catch((err) => console.log(err));
};

// 4. Blog Details (✅ FIX IS HERE)
const blogDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findById(id).populate('author');
        
        // ✅ CORRECT: .find() gets ALL comments. (.findOne gets only 1)
        const comments = await Comment.find({ blog: id })
            .populate('author')
            .sort({ createdAt: -1 }); // Newest on top

        res.render('details', { blog, comments, title: 'Blog Details' });
    } catch (err) {
        res.status(404).render('none', { title: 'Blog not found' });
    }
};

// 5. Post Comment
const postComment = async (req, res) => {
    try {
        const comment = new Comment({
            body: req.body.body,
            blog: req.params.id,
            author: req.userId
        });
        await comment.save();
        res.redirect(`/blogs/${req.params.id}`);
    } catch (err) {
        res.redirect(`/blogs/${req.params.id}`);
    }
};

// 6. Toggle Like
const toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog.likes.includes(req.userId)) {
            blog.likes.pull(req.userId);
        } else {
            blog.likes.push(req.userId);
        }
        await blog.save();
        res.redirect(`/blogs/${req.params.id}`);
    } catch (err) {
        res.redirect('/blogs');
    }
};

// 7. Get Edit Blog Form
const editBlogGet = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author');
        const user = await User.findById(req.userId);
        if (blog.author._id.equals(req.userId) || user.role === 'admin') {
            res.render('edit', { title: 'Edit Blog', blog });
        } else {
            res.status(403).render('none');
        }
    } catch (err) {
        res.status(404).render('none');
    }
};

// 8. Update Blog
const updateBlogPost = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const user = await User.findById(req.userId);
        if (blog.author.equals(req.userId) || user.role === 'admin') {
            await Blog.findByIdAndUpdate(req.params.id, req.body);
            res.redirect('/blogs/' + req.params.id);
        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (err) {
        res.redirect('/blogs');
    }
};

// 9. Delete Blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const user = await User.findById(req.userId);
        if (blog.author.equals(req.userId) || user.role === 'admin') {
            await Blog.findByIdAndDelete(req.params.id);
            res.redirect('/blogs');
        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (err) {
        res.redirect('/blogs');
    }
};

// 10. Get Edit Comment Form
const editCommentGet = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const comment = await Comment.findById(commentId).populate('author');
        const user = await User.findById(req.userId);
        if (comment.author._id.equals(req.userId) || user.role === 'admin') {
            res.render('editComment', { title: 'Edit Comment', comment, blogId: id });
        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (err) {
        res.status(404).render('none');
    }
};

// 11. Update Comment
const updateComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const comment = await Comment.findById(commentId);
        const user = await User.findById(req.userId);
        if (comment.author.equals(req.userId) || user.role === 'admin') {
            comment.body = req.body.body;
            await comment.save();
            res.redirect(`/blogs/${id}`);
        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (err) {
        res.redirect(`/blogs/${req.params.id}`);
    }
};

// 12. Delete Comment
const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const comment = await Comment.findById(commentId);
        const user = await User.findById(req.userId);
        if (comment.author.equals(req.userId) || user.role === 'admin') {
            await Comment.findByIdAndDelete(commentId);
            res.redirect(`/blogs/${id}`);
        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (err) {
        res.redirect(`/blogs/${req.params.id}`);
    }
};

module.exports = {
    allBlogs, blogDetails, createBlogGet, createBlogPost,
    editBlogGet, updateBlogPost, deleteBlog,
    postComment, toggleLike,
    editCommentGet, updateComment, deleteComment
};