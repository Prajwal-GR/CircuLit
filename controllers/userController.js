const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json({ userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { userId, answers } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if user has already submitted
        if (user.hasSubmittedQuiz) {
            return res.status(400).json({ message: 'Quiz already submitted', score: user.score });
        }
        // Process answers (mock scoring logic)
        let score = 0;
        if (answers.answer1.toLowerCase() === 'correct1') score += 50;
        if (answers.answer2.toLowerCase() === 'correct2') score += 50;
        // Update user
        user.score = score;
        user.hasSubmittedQuiz = true;
        await user.save();
        res.json({ score, message: 'Quiz submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};