'use strict';

var express = require('express');
var contactController = require('../controllers/contact');
var router = express.Router();

router.post('/list', contactController.list);
router.post('/add', contactController.add);
router.put('/edit', contactController.edit);
router.get('/list/:contactId', contactController.get);
router.delete('/list/:contactId', contactController.del);

module.exports = router;