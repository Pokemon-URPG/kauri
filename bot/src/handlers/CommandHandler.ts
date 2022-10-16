import { ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, CommandInteraction, CommandInteractionOption, ContextMenuCommandInteraction, Events, Interaction } from 'discord.js';
import type { KauriClient } from '../client/KauriClient';
import { ChatInputCommandModule, CommandModule } from '../typings';
import { BaseHandler, BaseHandlerOptions } from './BaseHandler.js';

export class CommandHandler extends BaseHandler<CommandModule> {
	public constructor(client: KauriClient, options: BaseHandlerOptions) {
		super(client, options);
	}

	public setup(): this {
		this.client.once('ready', () => {
			this.client.on(Events.InteractionCreate, async (i: Interaction) => {
				if (!i.inCachedGuild()) return;

				if (i.isChatInputCommand()) {
					await this.handleCommand(i);
				} else if (i.isAutocomplete()) {
					await this.handleAutocomplete(i);
				}
			});
		});

		return this;
	}

	private isSlash (module: CommandModule): module is ChatInputCommandModule { return module.data.toJSON().type === ApplicationCommandType.ChatInput }
	private isContext(module: CommandModule): module is ChatInputCommandModule { return module.data.toJSON().type !== ApplicationCommandType.ChatInput; }

	private async handleCommand(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
		try {
			const module = this.modules.get(interaction.commandName);

			if (!module) return;

			if (this.isSlash(module)) {
				await module.execute(interaction);
			} else if (this.isContext(module)) {
				await module.execute(interaction);
			}

			// if (module.defer) await interaction.deferReply();

		} catch (e: unknown) {
			console.error(e);
			if (e instanceof Error) {
				if (interaction.deferred) {
					await interaction.editReply(`[${interaction.commandName}] ${e.message}`);
				} else if (interaction.replied) {
					await interaction.followUp({
						content: `[${interaction.commandName}] ${e.message}`,
						ephemeral: Boolean(interaction.ephemeral)
					});
				} else {
					await interaction.reply({
						content: `[${interaction.commandName}] ${e.message}`,
						ephemeral: true
					});
				}
			}
		}
	}

	private async handleAutocomplete(interaction: AutocompleteInteraction<'cached'>): Promise<void> {
		try {
			const module = this.modules.get(interaction.commandName);
			if (!module || !this.isSlash(module) || !module.autocomplete) return;

			await module.autocomplete(interaction);
		} catch (e) {
			console.error(e);
		}
	}

	private async parseOptions(
		module: CommandModule,
		options?: readonly CommandInteractionOption[],
		sub?: { group?: string; command?: string }
	) {
		if (!options) return null;

		const args: { [key: string]: unknown } = {};

		for (const option of options) {
			switch (option.type) {
				case ApplicationCommandOptionType.Subcommand:
					args[option.name] = await this.parseOptions(module, option.options, { ...sub, command: option.name });
					break;
				case ApplicationCommandOptionType.SubcommandGroup:
					args[option.name] = await this.parseOptions(module, option.options, { ...sub, group: option.name });
					break;
				default:
					args[option.name] = await this.parseOption(module, option/* , sub */);
					break;
			}
		}

		return args;
	}

	private async parseOption(
		module: CommandModule,
		option: CommandInteractionOption,
		sub?: { group?: string; command?: string }
	) {
		switch (option.type) {
			case ApplicationCommandOptionType.String: {
				return /*await this.augmentOption(module, option, sub) ??*/ option.value;
			}
			case ApplicationCommandOptionType.Channel:
				return option.channel;
			case ApplicationCommandOptionType.User:
				return option.member ?? option.user;
			case ApplicationCommandOptionType.Role:
				return option.role;
			case ApplicationCommandOptionType.Attachment:
				return option.attachment;
			case ApplicationCommandOptionType.Integer:
			case ApplicationCommandOptionType.Boolean:
			case ApplicationCommandOptionType.Number:
			default:
				return option.value;
		}
	}

	// private async augmentOption(
	// 	module: ChatInputCommandModule,
	// 	option: CommandInteractionOption,
	// 	sub?: { group?: string; command?: string }
	// ): Promise<ModelInstance | null> {
	// 	let base;
	// 	if (sub?.group) {
	// 		base = module.options.find(
	// 			b =>
	// 				b.name === sub.group &&
	// 				b.type === ApplicationCommandOptionType.SubcommandGroup
	// 		)?.options ?? [];
	// 	}
	// 	if (sub?.command) {
	// 		base = (base ?? module.options).find(
	// 			b =>
	// 				b.name === sub.command &&
	// 				b.type === ApplicationCommandOptionType.Subcommand
	// 		)?.options ?? [];
	// 	}
	// 	base = (base ?? module.options).find(b => b.name === option.name);

	// 	if (!base || !base.augmentTo) return null;

	// 	const model = await Models[base.augmentTo].fetch(`${option.value as string}`);
	// 	return model ?? null;
	// }
}
