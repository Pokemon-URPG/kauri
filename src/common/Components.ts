import { ButtonStyle } from "discord.js";

export const Buttons = {
	Confirm: (id?: string) => ({ type: 2, customId: id ?? "confirm", label: "Confirm", style: ButtonStyle.Primary }),
	Cancel: (id?: string) => ({ type: 2, customId: id ?? "cancel", label: "Cancel", style: ButtonStyle.Secondary }),
};