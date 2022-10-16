import type { AutocompleteInteraction, Awaitable, ChatInputCommandInteraction, ClientEvents, ContextMenuCommandBuilder, ContextMenuCommandInteraction, Events, SlashCommandBuilder } from 'discord.js';

export interface CommandConfig {

}

export type ChatInputCommandModule = {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Awaitable<void>;
	autocomplete?: (interaction: AutocompleteInteraction) => Awaitable<void>;
	config?: CommandConfig;
	subcommands?: {
		[key:string]: (interaction: ChatInputCommandInteraction) => Awaitable<void>;
	}
}

export type ContextMenuCommandModule = {
	data: ContextMenuCommandBuilder;
	execute: (interaction: ContextMenuCommandInteraction) => Awaitable<void>;
	config?: CommandConfig;
}

export type CommandModule = ChatInputCommandModule | ContextMenuCommandModule;

export type EventModule = {
	data: EventData;
	execute: (...args: ClientEvents[K]) => Awaitable<void>;
}

export const enum EventEmitterType {
	Client = 'client',
	Websocket = 'websocket'
}

export const enum EventBindingType {
	On = 'on',
	Once = 'once'
}

export type EventData = {
	name: Events;
	type: EventBindingType;
	emitter: EventEmitterType;
}

export type Module = CommandModule | EventModule;