import type { User } from "discord.js";

export const Messages = {
	Commands: {
		Start: {
			AlreadyStarted: "You've already started your journey! Restarts are not yet supported.",
			ConfirmSelection: (pokemon: any) => `So! You want the ${pokemon.category}, ${pokemon.name}?`,
			InvalidChoice: "No matching Pokemon found. Make sure you select an option from the list!",
			SelectionCancelled: "Starter selection cancelled.",
			SelectionConfirmedPrivate: "Starter selection confirmed!",
			SelectionConfirmedPublic: (pokemon: any, user: User) => `${user} just chose to start their journey with ${pokemon.name}, the ${pokemon.category} as their partner!`,
			SelectionTimedOut: "Started selection timed out.",
		},
	},
};