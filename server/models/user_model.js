const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {type:String, required: true, unique: false},
    email: {type:String, required: true, unique: true},
    image: { type: String, default: "" },
    password: {type:String, required: true},
    createAt: {type:Date, default: Date.now}
});

const users = mongoose.model('users', UserSchema);

module.exports = users;