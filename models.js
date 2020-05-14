const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    author: {
        firstName: String,
        lastName: String
    }
})

blogPostSchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.author.firtName  + this.author.lastName
    };
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = { BlogPost };