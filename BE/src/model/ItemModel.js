const mongoose = require('mongoose');
const { Schema } = mongoose;
const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
});
const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },  
});
const moreSchema = new mongoose.Schema({
    prep_time: {type: String, required: true},
    cook_time: {type: String, required: true},
    serving_time: {type: String, required: true},
    difficulty: {type: String, required: true},
    source: {type: String, required: true},
});
const ItemSchema = new mongoose.Schema({
    menuId: {
        type :Number,
        required: true,
        min: 1,
        max: 6,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    thumbnail_image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    createdBy: { type: String, required: true },
    tags: [String],
    ingredients:{
        type: [ingredientSchema],
        required: true,
    },
    comments: {
        type: [commentSchema],
    },
    more: { type: moreSchema, required: true },
});
const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;