import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { request } from "undici";
import { findBestMatch } from "string-similarity";

export const data = new SlashCommandBuilder()
	.setName("start")
	.setDescription("Start your Pokemon URPG journey!")
	.addStringOption((option) => option.setName("pokemon")
		.setDescription("Which Pokemon do you choose?")
		.setRequired(true)
		.setAutocomplete(true));

export const autocomplete = async (interaction: AutocompleteInteraction<"cached">) => {
	const { data } = await request("https://kauri.monbrey.com.au/items/species").then(async ({ body }) => body.json());
	const names = data.map((d: any) => d.name);
	const { ratings } = findBestMatch(interaction.options.getFocused(), names);

	const response = ratings.sort((a, b) => b.rating - a.rating).map(r => ({ name: r.target, value: r.target })).slice(0, 5);
	void interaction.respond(response);
};

export const execute = async (interaction: ChatInputCommandInteraction<"cached">) => {
	void interaction.reply({
		content: "Got it",
		allowedMentions: { parse: [] },
		ephemeral: true,
	});
};
