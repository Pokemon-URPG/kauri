import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('say')
	.setDescription('Repeats your input')
	.addStringOption(option =>
		option.setName('text')
			.setDescription('Text to repeat')
			.setMaxLength(2000));

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const content = interaction.options.getString('text', true);
	interaction.reply({ content, allowedMentions: { parse: [] }, ephemeral: true });
}
