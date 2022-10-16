import type { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("say")
	.setDescription("Repeats your input")
	.addStringOption((option) => option.setName("text")
		.setDescription("Text to repeat")
		.setMaxLength(2_000));

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const content = interaction.options.getString("text", true);
	await interaction.reply({
		content,
		allowedMentions: { parse: [] },
		ephemeral: true,
	});
};
