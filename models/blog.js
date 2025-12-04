const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: { type: String, required: true },
    snippet: { type: String, required: true },
    body: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // ✅ NEW: Store IDs of users who liked this post
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;