import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { request } from "undici";
import { findBestMatch, Rating } from "string-similarity";

const cache: {
	data: string[];
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
		cache.data = data.filter((d: any) => d.starter_eligible).map((d: any) => d.name);
	}

	const { ratings } = findBestMatch(interaction.options.getFocused(), cache.data);
	const response = ratings.sort((a, b) => b.rating - a.rating).map(r => ({ name: r.target, value: r.target })).slice(0, 5);
	console.log(response);
	void interaction.respond(response);
};

export const execute = async (interaction: ChatInputCommandInteraction<"cached">) => {
	void interaction.reply({
		content: "Got it",
		allowedMentions: { parse: [] },
		ephemeral: true,
	});
};
