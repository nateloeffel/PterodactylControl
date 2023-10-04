const {
	EmbedBuilder,
	SlashCommandBuilder
} = require("discord.js");
require("dotenv").config();

const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("create-server")
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
		if (interaction.user.id !== "1127635089761763358")
			return await interaction.reply("You may not use this command.");

		const linkname = interaction.options.getString("linkname");
		const type = interaction.options.getString("type");
		await interaction.deferReply();

		const data = {
			name: linkname,
			user: 1,
			egg: type == "hypixel" ? 28 : 29,
			docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
			startup:
				'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; if [[ "${MAIN_FILE}" == "*.js" ]]; then /usr/local/bin/node "/home/container/${MAIN_FILE}" ${NODE_ARGS}; else /usr/local/bin/ts-node "/home/container/${MAIN_FILE}" ${NODE_ARGS}; fi',
			environment: {
				GIT_ADDRESS: `https://github.com/oldnateloeffel/${
					type == "hypixel" ? "hypixel" : "lunar"
				}-link`,
				BRANCH: "main",
				USER_UPLOAD: "0",
				AUTO_UPDATE: "1",
				USERNAME: "oldnateloeffel",
				ACCESS_TOKEN: GITHUB_TOKEN,
				MAIN_FILE: "main.js",
			},
			limits: {
				memory: 230,
				swap: 0,
				disk: 512,
				io: 500,
				cpu: 100,
			},
			feature_limits: {
				databases: 0,
				backups: 1,
			},
			deploy: {
				locations: [1],
				dedicated_ip: false,
				port_range: [],
			},
		};

		const request = await fetch(
			"https://panel.inqz.net/api/application/servers",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${PTERODACTYL_API_KEY}`,
				},
				body: JSON.stringify(data),
			}
		);
		const response = await request.json();
		const { id, uuid, name } = response.attributes;
		await interaction.editReply(
			"Server has been created! :white_check_mark:"
		);

		const req = await fetch("https://api.inqz.net/panel/createlink", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				linkname,
				uuid,
				type: interaction.options.getString("type"),
			}),
		});

		const embed = new EmbedBuilder()
			.setTitle("New Beaming Link Created!")
			.setColor("22bb33")
			.setDescription(
				`**Name:** \`${name}\`\n**UUID:** \`${uuid}\`\n**ID:** \`${id}\`\n`
			);
		// give them the information of their new server
		await interaction.followUp({ embeds: [embed] });
	},
};
