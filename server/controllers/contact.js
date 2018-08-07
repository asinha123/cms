'use strict';

var _ = require('underscore');
var db = require('../models');
var response = require('../util/apiResponse').response;

var list = function (req, res) {
  var clause = {};

  if (!_.isEmpty(req.body)) {
    var where = {};
    if (req.body.groupId) {
      where = { groupId: req.body.groupId };
    }
    if (req.body.searchText) {
      var Op = db.Sequelize.Op;
      where = _.extend({
        [Op.or]: [
          {
            status: {
              $like: '%' + req.body.searchText + '%'
            }
          },
          {
            email: {
              $like: '%' + req.body.searchText + '%'
            }
          },
          {
            fName: {
              $like: '%' + req.body.searchText + '%'
            }
          },
          {
            lName: {
              $like: '%' + req.body.searchText + '%'
            }
          }
        ]
      }, where);
    }

    clause = {
      where: where
    };
    if (req.body.pageNumber && req.body.pageSize) {
      var offset = ((req.body.pageNumber - 1) * req.body.pageSize);
      var limit = req.body.pageSize;
      clause = {
        offset: offset,
        limit: limit,
        where: where
      };
    }


  }
  db.contacts.findAndCountAll(_.extend({
    include: [{
      model: db.groups,
      include: [{
        model: db.users,
        attributes: {
          exclude: ['password']
        }
      }]
    }]
  }, {
      order: [
        ['contactId', 'DESC']
      ]
    }, clause)
  ).then(function (contacts) {
    var result = {};
    result.count = contacts.count;
    result.contactList = [];
    _.each(contacts.rows, function (contact) {
      result.contactList.push(contact.dataValues);
    });

    if (result.count) {
      response({ res, status: 200, message: 'Success', result: result });
    } else {
      response({ res, status: 204, result: result });
    }
  }).catch(function (err) {
    response({ res, status: 500, message: 'Internal server error.', result: err });
  });

};

var listByUser = function (req, res) {
  var clause = {};

  if (!_.isEmpty(req.body)) {
    var where = {};
    var userWhere = {};
    if (req.body.groupId) {
      where = { groupId: req.body.groupId };
    }
    if (req.body.userId) {
      userWhere = { userId: req.body.userId };
    }
    if (req.body.searchText) {
      var Op = db.Sequelize.Op;
      where = _.extend({
        [Op.or]: [
          {
            status: {
              $like: '%' + req.body.searchText + '%'
            }
          },
          {
            email: {
              $like: '%' + req.body.searchText + '%'
            }
          },
          {
            fName: {
              $like: '%' + req.body.searchText + '%'
            }
          },
          {
            lName: {
              $like: '%' + req.body.searchText + '%'
            }
          }
        ]
      }, where);
    }

    clause = {
      where: where
    };
    if (req.body.pageNumber && req.body.pageSize) {
      var offset = ((req.body.pageNumber - 1) * req.body.pageSize);
      var limit = req.body.pageSize;
      clause = {
        offset: offset,
        limit: limit,
        where: where
      };
    }


  }
  db.contacts.findAndCountAll(_.extend({
    include: [{
      model: db.groups,
      include: [{
        model: db.users,
        attributes: {
          exclude: ['password']
        },
        where: userWhere
      }]
    }]
  }, {
      order: [
        ['contactId', 'DESC']
      ]
    }, clause)
  ).then(function (contacts) {
    var result = {};
    result.count = contacts.count;
    result.contactList = [];
    _.each(contacts.rows, function (contact) {
      result.contactList.push(contact.dataValues);
    });

    if (result.count) {
      response({ res, status: 200, message: 'Success', result: result });
    } else {
      response({ res, status: 204, result: result });
    }
  }).catch(function (err) {
    response({ res, status: 500, message: 'Internal server error.', result: err });
  });

};

var get = function (req, res) {
  db.contacts.findById(req.params.contactId)
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
    email: req.body.email
  };
  db.contacts.findOne({
    where: whereClause
  }).then(function (result) {
    if (result === null) {
      db.contacts.create(req.body).then(function (result) {
        response({ res, status: 200, message: 'Contact added successfully.', result: result });
      }).catch(function (errors) {
        response({ res, status: 500, result: errors });
      });
    } else {
      response({ res, status: 409, message: 'Contact already exist with the same email Id.' });
    }
  });
};

var edit = function (req, res) {
  var whereClause = {
    email: req.body.email,
    $not: [
      { contactId: req.body.contactId }
    ]
  };

  db.contacts.findOne({
    where: whereClause
  }).then(function (result) {
    if (result === null) {
      db.contacts.update(req.body, {
        where: {
          contactId: req.body.contactId,
        }
      }).then(function (result) {
        response({ res, status: 200, message: 'Contact updated successfully.', result: result });
      }).catch(function (errors) {
        response({ res, status: 500, result: errors });
      });
    } else {
      response({ res, status: 409, message: 'Contact already exist with the same email.' });
    }
  });
};

var del = function (req, res) {
  db.contacts.destroy({
    where: {
      contactId: req.params.contactId
    }
  })
    .then(function (result) {
      response({ res, status: 200, message: 'contact with id ' + req.params.contactId + ' deleted successfully.', result: result });
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