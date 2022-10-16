import type { EventEmitter } from "node:events";
import { Collection } from "discord.js";
import type { KauriClient } from "../client/KauriClient";
import type { BaseHandlerOptions } from "./BaseHandler.js";
import { BaseHandler } from "./BaseHandler.js";
import type { EventModule } from "../typings/index.js";
import { EventEmitterType } from "../typings/index.js";

export class EventHandler extends BaseHandler<EventModule> {
	public emitters: Collection<EventEmitterType, EventEmitter>;

	public constructor(client: KauriClient, options: BaseHandlerOptions) {
		super(client, options);

		this.emitters = new Collection<EventEmitterType, EventEmitter>([[EventEmitterType.Client, this.client], [EventEmitterType.Websocket, this.client.ws]]);
	}

	protected override register(event: EventModule): this {
		super.register(event);
		this.addToEmitter(event);

		return this;
	}

	private addToEmitter(event: EventModule): this {
		try {
			const emitter = this.emitters.get(event.data.emitter);
			if (!emitter) {
				throw new Error("EMITTER_NOT_FOUND");
			}

			if (event.data.type === "once") {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				emitter.once(event.data.name, (...args: any[]) => event.execute(...args));
				return this;
			}

			emitter.on(event.data.name, (...args: any[]) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				void event.execute(...args);
			});

			return this;
		} catch (error) {
			console.error(error);
		}

		return this;
	}
}
