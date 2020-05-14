'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const blogPostSchema = mongoose.Schema({
    author: {
        firstName: String,
        lastName: String
    },
    title: { type: String, required: true},
    content: { type: String, required: true},
    created: { type: Date, default: Date.now}
});

blogPostSchema.virtual('authorName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.authorName,
        created: this.created
    };
};

// reference to collection name 
const BlogPost = mongoose.model('blog', blogPostSchema);

module.exports = { BlogPost };