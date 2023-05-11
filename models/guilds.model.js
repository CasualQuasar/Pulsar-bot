module.exports = (conn, Sequelize) => {
	return conn.define("guilds", {
		
	/* START OF MODEL */
		
		guildId: {
			type: Sequelize.BIGINT
		},
		guildName: {
			type: Sequelize.STRING
		},
        inviterId: {
            type: Sequelize.BIGINT
        },
        inviterName: {
            type: Sequelize.STRING
        },
        stillInServer: {
            type: Sequelize.BOOLEAN
        }

	/* END OF MODEL */
		
		
	});
};