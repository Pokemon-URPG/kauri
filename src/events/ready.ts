import { Events } from "discord.js";
import type { KauriClient } from "../client/KauriClient";
import type { EventData } from "../typings";
import { EventBindingType, EventEmitterType } from "../typings";

export const data: EventData = {
	name: Events.ClientReady,
	emitter: EventEmitterType.Client,
	type: EventBindingType.Once,
};

export const execute = (client: KauriClient) => {
	console.log("Ready");
};
