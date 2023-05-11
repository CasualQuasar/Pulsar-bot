const db = require("../../handlers/database-handler");
const { Op } = require("sequelize");

const Model = db["guilds"];

module.exports = {
	async execute(params) {
		//params in this event is the guild that the bot just joined
		
        Model.update({stillInServer: false}, {
            where: {
                guildId: params.id
            }
        })

        console.log('Left a guild! [' + params.name + "]")
	},
};