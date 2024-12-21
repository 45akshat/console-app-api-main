const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.post('/', UserController.createUser);
router.post('/getUserData', UserController.getUserById);
router.post('/updateProfile', UserController.updateProfile);
router.delete('/:id', UserController.deleteUser);
router.get('/', UserController.getAllUsers);
router.post('/update-cp', UserController.updateUserCP);
router.post('/update-streak', UserController.updateUserStreak);

// Check login date
router.get('/checkLoginDate/:userID', UserController.checkLoginDate);

module.exports = router;
