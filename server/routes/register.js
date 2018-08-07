'use strict';

var express = require('express');
var userController = require('../controllers/user');
var router = express.Router();


router.post('/register', userController.register);


module.exports = router;
