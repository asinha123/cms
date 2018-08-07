module.exports = function (sequelize, Sequelize) {
var users = sequelize.define('users', {
		userId: {
			type: Sequelize.INTEGER(10),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		userName: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		password: {
			type: Sequelize.STRING,
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
		aadhar: {
			type: Sequelize.STRING(100),
			allowNull: true
		},
		status: {
			type: Sequelize.ENUM('active', 'inactive'),
			defaultValue: 'active'
		}

	});

	return users;

};