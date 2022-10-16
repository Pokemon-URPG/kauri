import type { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface ChatInputCommandConfig {

}

export type ChatInputCommandFile = {
	config?: ChatInputCommandConfig;
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
} & {
	[key:string]: (interaction: ChatInputCommandInteraction) => Proise<void>;
}