'use strict';

var _ = require('underscore');
var db = require('../models');
var response = require('../util/apiResponse').response;

var list = function (req, res) {
  var clause = {};

  if (!_.isEmpty(req.body)) {
    var where = {};

    if (req.body.userId) {
      where = { userId: req.body.userId };
    }
    var offset = ((req.body.pageNumber - 1) * req.body.pageSize);
    var limit = req.body.pageSize;
    if (req.body.searchText) {
      var Op = db.Sequelize.Op;
      where = {
        [Op.or]: [
          {
            status: {
              $like: '%' + req.body.searchText + '%'
            }
          },
          {
            groupName: {
              $like: '%' + req.body.searchText + '%'
            }
          }
        ]
      }
    }
    clause = {
      offset: offset,
      limit: limit,
      where: where
    };
  }
  db.groups.findAndCountAll(_.extend({

    order: [
      ['groupId', 'DESC']
    ]
  }, clause)
  ).then(function (groups) {
    var result = {};
    result.count = groups.count;
    result.groupList = [];
    _.each(groups.rows, function (group) {
      result.groupList.push(group.dataValues);
    });

    if (result.count) {
      response({ res, status: 200, message: 'Success', result: result });
    } else {
      response({ res, status: 204 });
    }
  }).catch(function (err) {
    response({ res, status: 500, message: 'Internal server error.', result: err });
  });

};

var get = function (req, res) {
  db.groups.findById(req.params.groupId)
    .then(function (result) {
      if (result) {
        response({ res, status: 200, message: 'Success', result: result });
      } else {
        response({ res, status: 500, result: result });
      }
    })
    .catch(function (errors) {
      response({ res, status: 500, result: errors });
    });
};

var add = function (req, res) {
  var whereClause = {
    groupName: req.body.groupName
  };
  db.groups.findOne({
    where: whereClause
  }).then(function (result) {
    if (result === null) {
      db.groups.create(req.body).then(function (result) {
        response({ res, status: 200, message: 'Group added successfully.', result: result });
      }).catch(function (errors) {
        response({ res, status: 500, result: errors });
      });
    } else {
      response({ res, status: 409, message: 'Group already exist with the same group name.' });
    }
  });
};

var edit = function (req, res) {
  var whereClause = {
    groupName: req.body.groupName,
    $not: [
      { groupId: req.body.groupId }
    ]
  };

  db.groups.findOne({
    where: whereClause
  }).then(function (result) {
    if (result === null) {
      db.groups.update(req.body, {
        where: {
          groupId: req.body.groupId,
        }
      }).then(function (result) {
        response({ res, status: 200, message: 'Group updated successfully.', result: result });
      }).catch(function (errors) {
        response({ res, status: 500, result: errors });
      });
    } else {
      response({ res, status: 409, message: 'Group already exist with the same group name.' });
    }
  });
};

var del = function (req, res) {
  db.groups.destroy({
    where: {
      groupId: req.params.groupId
    }
  })
    .then(function (result) {
      response({ res, status: 200, message: 'Group with id ' + req.params.groupId + ' deleted successfully.', result: result });
    })
    .catch(function (errors) {
      response({ res, status: 500, result: errors });
    });
};

module.exports = {
  list: list,
  get: get,
  add: add,
  edit: edit,
  del: del
};