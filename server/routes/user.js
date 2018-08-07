'use strict';

var express = require('express');
var userController = require('../controllers/user');
var router = express.Router();
var jws = require('express-jwt-session');
var secret = 'this is the secret';
var isAuthenticated = jws.isAuthenticated(secret);

router.get('/checkAuth', isAuthenticated, function (req, res, next) {
  res.send(req.user);
  res.end();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/list', userController.list);
router.post('/login', userController.login);
router.get('/list/:userId', userController.get);
router.put('/edit', userController.edit);
router.put('/changePassword', userController.changePassword);


module.exports = router;
