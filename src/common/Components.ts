import { ButtonStyle, ComponentType } from "discord.js";

export const Buttons = {
	Confirm: (id?: string) => ({ type: ComponentType.Button, customId: id ?? "confirm", label: "Confirm", style: ButtonStyle.Primary }),
	Cancel: (id?: string) => ({ type: ComponentType.Button, customId: id ?? "cancel", label: "Cancel", style: ButtonStyle.Secondary }),
};