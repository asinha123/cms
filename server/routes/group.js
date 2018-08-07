'use strict';

var express = require('express');
var groupController = require('../controllers/group');
var router = express.Router();

router.post('/list', groupController.list);
router.post('/add', groupController.add);
router.put('/edit', groupController.edit);
router.get('/list/:groupId', groupController.get);
router.delete('/list/:groupId', groupController.del);

module.exports = router;