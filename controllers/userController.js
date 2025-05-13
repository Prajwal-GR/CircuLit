const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path')

exports.getIndex = (req,res) =>{
    res.sendFile(path.join(__dirname, '../','public', 'index.html'));
}

exports.getregister = (req, res) => {
    res.sendFile(path.join(__dirname, '../','public', 'create-account.html'));
};

exports.getlogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../','public', 'login.html'));
};


exports.getQuiz = (req, res) => {
    res.sendFile(path.join(__dirname, '../','public', 'quiz.html'));
};

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

        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has already submitted
        if (user.hasSubmittedQuiz) {
            return res.status(400).json({ message: 'Quiz already submitted', score: user.score });
        }

        // Array of correct answers
        const correctAnswers = ['correct1', 'correct2', 'correct3', 'correct2', 'correct2'];

        // Extract user answers into an array
        const userAnswers = [
            answers.answer1.toLowerCase(),
            answers.answer2.toLowerCase(),
            answers.answer3.toLowerCase(),
            answers.answer4.toLowerCase(),
            answers.answer5.toLowerCase()
        ];

        // Calculate score using a for-loop
        let score = 0;
        for (let i = 0; i < correctAnswers.length; i++) {
            if (userAnswers[i] === correctAnswers[i]) {
                score += 50; // 50 points for each correct answer
            }
        }

        // Update user
        user.score = score;
        user.hasSubmittedQuiz = true;
        user.submittedAnswers = userAnswers;
        await user.save();

        // Send response
        res.json({ score, message: 'Quiz submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// exports.submitQuiz = async (req, res) => {
//     try {
//         const { userId, answers } = req.body;
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         // Check if user has already submitted
//         if (user.hasSubmittedQuiz) {
//             return res.status(400).json({ message: 'Quiz already submitted', score: user.score });
//         }
//         // Process answers (mock scoring logic)
//         let score = 0;
//         if (answers.answer1.toLowerCase() === 'correct1') score += 50;
//         if (answers.answer2.toLowerCase() === 'correct2') score += 50;
//         if (answers.answer3.toLowerCase() === 'correct3') score += 50;
//         if (answers.answer4.toLowerCase() === 'correct2') score += 50;
//         if (answers.answer5.toLowerCase() === 'correct2') score += 50;
//         // Update user
//         user.score = score;
//         user.hasSubmittedQuiz = true;
//         await user.save();
//         res.json({ score, message: 'Quiz submitted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// exports.submitQuiz = async (req, res) => {
//     try {
//         const { userId, answers } = req.body;
//         const user = await User.findById(userId);
//         console.log("user",user);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }


//         if (user.hasSubmittedQuiz) {
//             return res.status(400).json({ message: 'Quiz already submitted', score: user.score });
//         }

//         const correctAnswers = ["correct1", "correct2","correct3","correct4","correct5"];  // Correct answers stored here

//         // Process user answers and compare with correct answers
//         let score = 0;
//         answers.forEach((answer, index) => {
//             if (answer.toLowerCase() === correctAnswers[index].toLowerCase()) {
//                 score += 50; // Award points for each correct answer
//             }
//         });

//         // Store correct answers on the server (if you need to log or store them)
//       //  user.submittedAnswers = answers;  // Save correct answers for future use (optional)

//         // Store user’s score and submission status
//         user.score = score;
//         user.hasSubmittedQuiz = true;
//         console.log("before save");
//         await user.save();

//         // Send response back to the client
//         res.json({ score, message: 'Quiz submitted successfully' });
//     } catch (error) {
//         console.log("Here")
//         res.status(500).json({ message: 'Server error' });
//     }
// };
