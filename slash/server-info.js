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
require("dotenv").config();

const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server-info")
		.setDescription("Get information about a server.")
		.addIntegerOption((option) =>
			option
				.setMinValue(1)
				.setName("server-id")
				.setDescription("ID of the server you would like to query.")
				.setRequired(true)
		),

	run: async ({ client, interaction }) => {
		if (interaction.user.id !== "1127635089761763358")
			return await interaction.reply("You may not use this command.");

		const serverId = interaction.options.getInteger("server-id");
		// validate the request
		if (interaction.options.getString("type") == "lunar")
			return await interaction.reply("This feature is not enabled yet.");
		// set message status to thinking while api request is being sent
		await interaction.deferReply();

		const request = await fetch(
			`https://panel.inqz.net/api/application/servers/${serverId}?include=allocations`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${PTERODACTYL_API_KEY}`,
				},
			}
		);
		if (request.status !== 200) {
			return await interaction.editReply(
				"No server found with this ID. Please try again."
			);
		}
		await interaction.editReply("Server Found! :white_check_mark:");
		const response = await request.json();
		const {
			id,
			uuid,
			name,
			description,
			limits,
			container,
			relationships,
		} = response.attributes;

		const allocationData =
			response.attributes.relationships.allocations.data[0];
		const alias = allocationData.attributes.alias;
		const port = allocationData.attributes.port;

		const embed = new EmbedBuilder({
			title: `Server Information for ${name}`,
			fields: [
				{
					name: "ID",
					value: id.toString(),
					inline: true,
				},
				{
					name: "UUID",
					value: uuid,
					inline: true,
				},
				{
					name: "Alias (IP)",
					value: alias || "No alias available",
					inline: true,
				},
				{
					name: "Description",
					value: description || "No description available",
					inline: false, // setting this to false as description might be long
				},
				{
					name: "Memory Limit",
					value: `${limits.memory} MB`,
					inline: true,
				},
				{
					name: "Disk Limit",
					value: `${limits.disk} MB`,
					inline: true,
				},
				{
					name: "CPU Limit",
					value: `${limits.cpu}%`,
					inline: true,
				},
				{
					name: "Container Image",
					value: container.image,
					inline: true,
				},
				{
					name: "Location",
					value: response.attributes.container.environment.P_SERVER_LOCATION,
					inline: true,
				},
				{
					name: "Port",
					value: port ? port.toString() : "No port available",
					inline: true,
				},
				{
					name: "Status",
					value: response.attributes.suspended
						? "Suspended"
						: "Active",
					inline: false, // setting this to false as this is important info
				},
			],
			timestamp: new Date(),
		}).setColor(response.attributes.suspended ? "Orange" : "22bb33");
		

		// give them the information of their new server
		await interaction.followUp({ embeds: [embed] });
	},
};
