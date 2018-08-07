var _ = require('underscore');
var jws = require('express-jwt-session');
var secret = 'this is the secret';

var response = require('../util/apiResponse').response;
var passHash = require('../util/passHash');
var db = require('../models');
var login = function (req, res) {
//	var hashedPass = passHash.validate(hash, req.body.password);
	db.users.findOne({ where: { email: req.body.email} }).then(result => {
		if (result) {
			var hashedPass = passHash.validate(result.dataValues.password, req.body.password);
			if (hashedPass) {
				var token = jws.signToken({ userName: result.dataValues.userName, userId: result.dataValues.userId }, secret, '1d');
				res.json({token : token});
				//response({ res, status: 200, message: 'Success', result: token });
			}
			else {
				response({ res, status: 401, message: 'Success', result: 'Wrong password' });
				//res.status(401).send('Wrong password');
			}
		}
		else {
			response({ res, status: 401, message: 'Success', result: 'Wrong user or password' });
			//res.status(401).send('   Wrong user or password');
		}
	});
};

var list = function (req, res) {
	var clause = {};
	if (!_.isEmpty(req.body)) {
		var offset = ((req.body.pageNumber - 1) * req.body.pageSize);
		var sort = req.body.sort ? req.body.sort : null;
		var order = req.body.order ? req.body.order : "DESC";
		var limit = req.body.pageSize;
		clause = { offset: req.body.offset, limit: req.body.limit };
	}

	db.users.findAndCountAll(_.extend({
		attributes: {
			exclude: ['password']
		},
		order: [
			[sort, order]
		]
	}, clause)
	).then(function (users) {
		var result = {};
		result.count = users.count;
		result.userList = [];
		_.each(users.rows, function (user) {
			result.userList.push(user.dataValues);
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

var register = function (req, res) {

	var whereClause = {
		userName: req.body.userName
	};

	db.users.findOne({
		where: whereClause
	}).then(function (result) {
		if (result === null) {
			req.body.password = passHash.hash(req.body.password); //hashing the password
			db.users.create(req.body).then(function (result) {
				response({ res, status: 200, message: 'Registered Successfully.', result: result });
			}).catch(function (errors) {
				response({ res, status: 500, result: errors });
			});
		} else {
			response({ res, status: 409, message: 'User already exist with the same username.' });
		}
	});
};

var get = function (req, res) {
  db.users.findById(req.params.userId)
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

var edit = function (req, res) {
  var whereClause = {
    email: req.body.email,
    $not: [
      { userId: req.body.userId }
    ]
  };

  db.users.findOne({
    where: whereClause
  }).then(function (result) {
    if (result === null) {
      db.users.update(req.body, {
        where: {
          userId: req.body.userId,
        }
      }).then(function (result) {
        response({ res, status: 200, message: 'Profile updated successfully.', result: result });
      }).catch(function (errors) {
        response({ res, status: 500, result: errors });
      });
    } else {
      response({ res, status: 409, message: 'Profile already exist with the same email Id.' });
    }
  });
};

var changePassword = function (req, res) {
	db.users.findById(req.body.userId)
		.then(function (result) {
			
			if (result) {
				if (passHash.validate(result.dataValues.password, req.body.oldPassword)) {
					req.body.password = passHash.hash(req.body.newPassword);
					db.users.update(req.body, {
						where: {
							userId: req.body.userId,
						}
					}).then(function (result) {
						response({ res, status: 200, message: 'Password updated successfully.', result: result });
					}).catch(function (errors) {
						response({ res, status: 500, result: errors });
					});
				} else {
					response({ res, status: 500, message: 'Password Mismatched.' });
				}
			} else {
				response({ res, status: 500 });
			}
		})
		.catch(function (errors) {
			response({ res, status: 500, result: errors });
		});


};

module.exports = {
	login: login,
	list: list,
	register: register,
	get: get,
	edit: edit,
	changePassword: changePassword
};