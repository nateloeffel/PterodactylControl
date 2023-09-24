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

        // validate the request

        // set message status to thinking while api request is being sent

        // give them the information of their new server

		return await interaction.reply("Pong!");
	},
};
