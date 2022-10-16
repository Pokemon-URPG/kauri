import type { EventEmitter } from 'node:events';
import { Collection } from 'discord.js';
import type { KauriClient } from '../client/KauriClient';
import { BaseHandler, BaseHandlerOptions } from './BaseHandler.js';
import { EventEmitterType, EventModule } from '../typings';

export class EventHandler extends BaseHandler<EventModule> {
	public emitters: Collection<EventEmitterType, EventEmitter>;

	public constructor(client: KauriClient, options: BaseHandlerOptions) {
		super(client, options);

		this.emitters = new Collection<EventEmitterType, EventEmitter>([
			[EventEmitterType.Client, this.client],
			[EventEmitterType.Websocket, this.client.ws]
		]);
	}

	protected override register(event: EventModule): this {
		super.register(event);
		this.addToEmitter(event);

		return this;
	}

	private addToEmitter(event: EventModule): this {
		try {
			const emitter = this.emitters.get(event.data.emitter);
			if (!emitter) throw new Error('EMITTER_NOT_FOUND');

			if (event.data.type === 'once') {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				emitter.once(event.data.name, (...args: any[]) => event.execute(...args));
				return this;
			}

			emitter.on(event.data.name, (...args: any[]) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				event.execute(...args);
			});

			return this;
		} catch (e) {
			console.error(e);
		}

		return this;
	}

	// private removeFromEmitter(name: string): this {
	// 	try {
	// 		const event = container.resolve<Event>(name);

	// 		const emitter = this.emitters.get(event.emitter);
	// 		if (!emitter) throw new Error('EMITTER_NOT_FOUND');

	// 		emitter.removeListener(event.name, event.runEvent);
	// 		return this;
	// 	} catch (e) {
	// 		this.client.logger.captureException(e);
	// 	}

	// 	return this;
	// }
}
