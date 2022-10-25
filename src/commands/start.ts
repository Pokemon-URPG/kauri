import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { findBestMatch } from "string-similarity";
import { Buttons } from "../common/Components.js";
import { Messages } from "../common/Messages.js";

const cache: {
	data: any[];
	lastFetched: number;
} = {
	data: [],
	lastFetched: 0,
};

export const data = new SlashCommandBuilder()
	.setName("start")
	.setDescription("Start your Pokemon URPG journey!")
	.addStringOption((option) => option.setName("pokemon")
		.setDescription("Which Pokemon do you choose?")
		.setRequired(true)
		.setAutocomplete(true));

export const autocomplete = async (interaction: AutocompleteInteraction<"cached">) => {
	if (cache.lastFetched < Date.now() - 86400) {
		const { data } = await interaction.client.db.items("species").readByQuery({
			fields: ["name", "id", "category"],
			filter: { starter_eligible: true },
			limit: -1,
		});

		if (data?.length) {
			cache.data = data;
			cache.lastFetched = Date.now();
		}
	}

	const { ratings } = findBestMatch(interaction.options.getFocused(), cache.data.map((d: any) => d.name));
	const response = ratings.sort((a, b) => b.rating - a.rating).map(r => ({ name: r.target, value: r.target })).slice(0, 5);
	void interaction.respond(response);
};

export const execute = async (interaction: ChatInputCommandInteraction<"cached">) => {
	const { data } = await interaction.client.db.items("trainers").readByQuery({ filter: { discord_id: { _eq: interaction.user.id } } });
	if (data?.length !== 0) {
		return void interaction.reply({
			content: Messages.Commands.Start.AlreadyStarted,
			ephemeral: true,
		});
	}

	const selection = interaction.options.getString("pokemon");
	const pokemon = cache.data.find(d => d.name === selection);

	if (!pokemon) {
		void interaction.reply({
			content: Messages.Commands.Start.InvalidChoice,
			ephemeral: true,
		});
		return;
	}

	const reply = await interaction.reply({
		content: Messages.Commands.Start.ConfirmSelection(pokemon),
		components: [{ type: 1, components: [Buttons.Cancel(), Buttons.Confirm()] }],
		ephemeral: true,
	});

	try {
		const btn = await reply.awaitMessageComponent({ time: 60000 });
		switch (btn.customId) {
			case "cancel":
				void btn.update({
					content: Messages.Commands.Start.SelectionCancelled,
					components: [],
				});
				return;
			case "confirm":
				await btn.update({
					content: Messages.Commands.Start.SelectionConfirmedPrivate,
					components: [],
				});
				await interaction.client.db.items("trainers").createOne({
					discord_id: interaction.user.id,
					name: interaction.user.username,
					cash: 5000,
					roster: {
						create: [{ trainer_id: "+", species_id: pokemon.id }],
					},
				});
				if (btn.channel) {
					void btn.channel.send({
						content: Messages.Commands.Start.SelectionConfirmedPublic(pokemon, btn.user),
					});
				}
		}
	} catch (e) {
		void interaction.editReply({
			content: Messages.Commands.Start.SelectionTimedOut,
			components: [],
		});
	}
};