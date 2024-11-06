const mongoose = require('mongoose');

const blog = mongoose.model(
    'blog',
    mongoose.Schema({
        titulo: String,
        linkimg: String,
        fechaPublicacion: String,
        texto: String
    })
);

module.exports = blog;
