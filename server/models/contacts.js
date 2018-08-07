module.exports = function (sequelize, Sequelize) {

  var contacts = sequelize.define('contacts', {
    contactId: {
      type: Sequelize.INTEGER(10),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    fName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    lName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(100)
    },
    phone: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    groupId: {
      type: Sequelize.INTEGER(10),
      allowNull: false
    }



  });

  return contacts;

};