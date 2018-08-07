module.exports = function (sequelize, Sequelize) {

	var groups = sequelize.define('groups', {
		groupId: {
      type: Sequelize.INTEGER(10),
			autoIncrement: true,
			primaryKey: true,
      allowNull: false
		},
		groupName: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		
		status: {
			type: Sequelize.ENUM('active', 'inactive'),
			defaultValue: 'active'
		},

    userId: {
      type: Sequelize.INTEGER(10),
      allowNull: false
    }

    

	});

	return groups;

};