const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    score: { type: Number, default: 0 },
    hasSubmittedQuiz: { type: Boolean, default: false } // Tracks quiz submission
});

module.exports = mongoose.model('User', userSchema);