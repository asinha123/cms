"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");

var dbFilePath = './dbConfig/dbConfig.json';
var fileContent = fs.readFileSync(dbFilePath);
var config = JSON.parse(fileContent);
var db = {};
var sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(function () {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.error('Unable to connect to the database:', err);
  });

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});


  db.groups.belongsTo(db.users ,{foreignKey: 'userId', targetKey: 'userId'});
  db.users.hasMany(db.groups ,{foreignKey: 'userId', targetKey: 'userId'});

  db.contacts.belongsTo(db.groups ,{foreignKey: 'groupId', targetKey: 'groupId'});
  db.groups.hasMany(db.contacts,{foreignKey: 'groupId', sourceKey: 'groupId'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
