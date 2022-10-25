import type { ButtonComponentData } from "discord.js";
import { ButtonStyle, ComponentType } from "discord.js";

/**
 * Reusable standard buttons
 */
export const Buttons = {
	Confirm: (id?: string): ButtonComponentData => ({ type: ComponentType.Button, customId: id ?? "confirm", label: "Confirm", style: ButtonStyle.Primary }),
	Cancel: (id?: string): ButtonComponentData => ({ type: ComponentType.Button, customId: id ?? "cancel", label: "Cancel", style: ButtonStyle.Secondary }),
};