const express = require('express');

const register = require('../controllers/user/register');
const login = require('../controllers/user/login');

const userRouter = express.Router();

userRouter.post('/register', register)

userRouter.post('/login', login);

// delete account 

// fogort password 

// change username 

// change email 

// change password 

// change profile picture 

module.exports = userRouter;
