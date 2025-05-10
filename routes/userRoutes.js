const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/',userController.getIndex);
// router.get('/register', userController.getregister);
router.get('/login', userController.getlogin);
router.get('/quiz', userController.getQuiz);
router.get('/create-account',userController.getregister);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/submit-quiz', userController.submitQuiz);

module.exports = router;