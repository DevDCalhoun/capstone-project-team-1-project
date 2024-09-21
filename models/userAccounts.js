const mongoose = require('mongoose');
const Schema = mongoose.Schema; // shortcut to mongoose

const UserAccountSchema = new Schema({
    username: String,
    password: String,
    email: String,
    major: String,

});

module.exports = mongoose.model('User Accounts', UserAccountSchema);