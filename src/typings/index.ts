import type { Directus, TypeMap } from "@directus/sdk";
import type { AutocompleteInteraction, Awaitable, ChatInputCommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, Events, SlashCommandBuilder } from "discord.js";

declare module "discord.js" {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Client {
		db: Directus<TypeMap>;
	}
}
export type CommandConfig = {

};

export type ChatInputCommandModule = {
	autocomplete?(interaction: AutocompleteInteraction): Awaitable<void>;
	config?: CommandConfig;
	data: SlashCommandBuilder;
	execute(interaction: ChatInputCommandInteraction): Awaitable<void>;
	subcommands?: {
		[key: string]: (interaction: ChatInputCommandInteraction) => Awaitable<void>;
	};
};

export type ContextMenuCommandModule = {
	config?: CommandConfig;
	data: ContextMenuCommandBuilder;
	execute(interaction: ContextMenuCommandInteraction): Awaitable<void>;
};

export type CommandModule = ChatInputCommandModule | ContextMenuCommandModule;

export type EventModule = {
	data: EventData;
	execute(...args: any[]): Awaitable<void>;
};

export const enum EventEmitterType {
	Client = "client",
	Websocket = "websocket",
}

export const enum EventBindingType {
	On = "on",
	Once = "once",
}

export type EventData = {
	emitter: EventEmitterType;
	name: Events;
	type: EventBindingType;
};

export type Module = CommandModule | EventModule;
