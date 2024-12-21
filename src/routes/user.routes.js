const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.post('/', UserController.createUser);
router.get('/:id', UserController.getUserById);
router.post('/updateProfile', UserController.updateProfile);
router.delete('/:id', UserController.deleteUser);
router.get('/', UserController.getAllUsers);

// Check login date
router.get('/checkLoginDate/:userID', UserController.checkLoginDate);

module.exports = router;
