import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { ButtonStyle } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { request } from "undici";
import { findBestMatch, Rating } from "string-similarity";

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
		const { data } = await request("https://kauri.monbrey.com.au/items/species", {
			query: { limit: 1000 },
		}).then(async ({ body }) => body.json());
		cache.data = data.filter((d: any) => d.starter_eligible);
	}

	const { ratings } = findBestMatch(interaction.options.getFocused(), cache.data.map((d: any) => d.name));
	const response = ratings.sort((a, b) => b.rating - a.rating).map(r => ({ name: r.target, value: r.target })).slice(0, 5);
	console.log(response);
	void interaction.respond(response);
};

export const execute = async (interaction: ChatInputCommandInteraction<"cached">) => {
	const selection = interaction.options.getString("pokemon");
	const pokemon = cache.data.find(d => d.name === selection);

	if (!pokemon) {
		void interaction.reply({
			content: "No matching Pokemon found. Make sure you select an option from the list!",
			ephemeral: true,
		});
		return;
	}

	const reply = await interaction.reply({
		content: `So! You want the ${pokemon.type1} Pokémon, ${pokemon.name}?`,
		components: [{
			type: 1, components: [{
				type: 2,
				customId: "cancel",
				label: "Cancel",
				style: ButtonStyle.Secondary,
			}, {
				type: 2,
				customId: "confirm",
				label: "Confirm",
				style: ButtonStyle.Primary,
			}],
		}],
		ephemeral: true,
	});

	try {
		const btn = await reply.awaitMessageComponent({ time: 60000 });
		switch (btn.customId) {
			case "cancel":
				void btn.update({
					content: "Starter selection cancelled.",
					components: [],
				});
				return;
			case "confirm":
				await btn.update({
					content: "Selection confirmed!",
					components: [],
				});
				void btn.followUp({
					content: `${btn.user} just chose to start their journey with ${pokemon.name} as their partner!`,
				});
		}
	} catch (e) {
		void interaction.editReply({
			content: "Starter selection timed out.",
			components: [],
		});
	}

};
