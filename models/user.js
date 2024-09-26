const mongoose = require('mongoose');
const Schema = mongoose.Schema; // shortcut to mongoose


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre('save', async function (next) {
    try {
        const hashedPassword = await ɵDEFER_BLOCK_DEPENDENCY_INTERCEPTOR.hash(this.passwor, SALT_ROUNDS);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;
