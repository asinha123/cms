'use strict';

var response = function (req) {
  req.result = req.result ? req.result : null;
  req.message = req.status !== 204 ? req.message : '';
  req.res.status(req.status)
    .json({
      responseMessage: req.message,
      result: req.result
    }).end();
}

module.exports = {
  response: response
}