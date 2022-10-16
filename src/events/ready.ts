import { Events } from 'discord.js';
import { KauriClient } from '../client/KauriClient';
import { EventBindingType, EventData, EventEmitterType } from '../typings';

export const data: EventData = {
	name: Events.ClientReady,
	emitter: EventEmitterType.Client,
	type: EventBindingType.Once,
}

export const execute = (client: KauriClient) => {
	console.log("Ready");
}