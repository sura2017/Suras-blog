const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    // Which blog does this belong to?
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    // Who wrote the comment?
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);