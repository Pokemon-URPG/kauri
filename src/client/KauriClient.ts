import { join } from "node:path";
import type { ClientOptions } from "discord.js";
import { Client } from "discord.js";
import { CommandHandler } from "../handlers/CommandHandler.js";
import { EventHandler } from "../handlers/EventHandler.js";

export class KauriClient extends Client {
	public slashCommands: CommandHandler;

	public events: EventHandler;

	public constructor(options: ClientOptions) {
		super(options);

		this.slashCommands = new CommandHandler(this, { directory: join(__dirname, "commands", "") }).loadAll().setup();

		this.events = new EventHandler(this, { directory: join(__dirname, "events") }).loadAll();
	}
}
