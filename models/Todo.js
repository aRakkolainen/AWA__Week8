const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

let todoSchema = new Schema({
    user: {type: ObjectId},
    items: {type: Array}, 
})

module.exports = mongoose.model("todos", todoSchema);