const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	TextInputBuilder,
	ModalBuilder,
	TextInputStyle,
	InteractionType,
	SlashCommandBuilder,
	SelectMenuBuilder,
} = require("discord.js");
require("dotenv").config()

const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY

module.exports = {
	data: new SlashCommandBuilder()
		.setName("create-link")
		.setDescription("Create a beaming link!")
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription(
					"Choose whether this link is a Lunar or Hypixel link."
				)
				.setRequired(true)
				.addChoices(
					{
						name: "Hypixel",
						value: "hypixel",
					},
					{
						name: "Lunar",
						value: "lunar",
					}
				)
		)
		.addStringOption((option) =>
			option
				.setName("linkname")
				.setDescription("The name of the link you are creating.")
				.setRequired(true)
		),

	run: async ({ client, interaction }) => {
		if (interaction.user.id !== "1127635089761763358") return await interaction.reply("You may not use this command.")

		const linkname = interaction.options.getString("linkname")

		// validate the request
		if (interaction.options.getString("type") == "lunar") return await interaction.reply("This feature is not enabled yet.")
		// set message status to thinking while api request is being sent
		await interaction.deferReply()


		const data = {
			"name": linkname,
			"user": 1,
			"egg": 28,
			"docker_image": "ghcr.io/parkervcp/yolks:nodejs_20",
			"startup": "if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == \"1\" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; if [[ \"${MAIN_FILE}\" == \"*.js\" ]]; then /usr/local/bin/node \"/home/container/${MAIN_FILE}\" ${NODE_ARGS}; else /usr/local/bin/ts-node \"/home/container/${MAIN_FILE}\" ${NODE_ARGS}; fi",
			"environment": {
				"GIT_ADDRESS": "https://github.com/nateloeffel/hypixel-link",
				"BRANCH": "main",
				"USER_UPLOAD": "0",
				"AUTO_UPDATE": "1",
				"USERNAME": "nateloeffel",
				"ACCESS_TOKEN": "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",
				"MAIN_FILE": "index.js"
			},
			"limits": {
				"memory": 230,
				"swap": 0,
				"disk": 512,
				"io": 500,
				"cpu": 100
			},
			"feature_limits": {
				"databases": 0,
				"backups": 1
			},
			deploy: {
				locations: [1],
				dedicated_ip: false,
				port_range: [],
			},
		}

		const request = await fetch("https://panel.inqz.net/api/application/servers", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": `Bearer ${PTERODACTYL_API_KEY}`
			},
			body: JSON.stringify(data)
		})
		const response = await request.json()
		const { id, uuid, name } = response.attributes
		await interaction.editReply("Server has been created! :white_check_mark:");

		const embed = new EmbedBuilder()
			.setTitle("New Beaming Link Created!")
			.setColor("22bb33")
			.setDescription(`**Name:** \`${name}\`\n**UUID:** \`${uuid}\`\n**ID:** \`${id}\`\n`)
		// give them the information of their new server
		await interaction.followUp({ embeds: [embed] })
	},
};
