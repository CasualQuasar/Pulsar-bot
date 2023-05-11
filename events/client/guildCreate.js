const db = require("../../handlers/database-handler");
const { Op } = require("sequelize");

const Model = db["guilds"];

module.exports = {
	async execute(params) {
		//params in this event is the guild that the bot just joined
		let logs = await params.fetchAuditLogs(
		{
			before: null, 
			limit: null, 
			user: null, 
			type: 28
		})
		logs = logs.entries
		let log;

		logs.some(async (val) => {
			if(val.target.id == '1042497323902718002') {
				log = val;
				return false;
			}
			return true;
		})

		if(!log)
			log = {
				executor: {
					id: null,
					tag: null
				}
			}

		const data = {
			guildId: params.id,
			guildName: params.name,
			inviterId: log.executor.id,
			inviterName: log.executor.tag,
			stillInServer: true
		}

		Model.create(data)

        console.log('Joined a new guild! [' + params.name + ']')
	},
};