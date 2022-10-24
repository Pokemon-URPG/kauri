import { join } from "node:path";
import type { ClientOptions } from "discord.js";
import { Client } from "discord.js";
import { CommandHandler } from "../handlers/CommandHandler.js";
import { EventHandler } from "../handlers/EventHandler.js";
import { Directus } from "@directus/sdk";

export class KauriClient extends Client {
	public slashCommands: CommandHandler;

	public events: EventHandler;

	public db = new Directus("https://kauri.monbrey.com.au");

	public constructor(options: ClientOptions) {
		super(options);

		this.slashCommands = new CommandHandler(this, { directory: join(__dirname, "commands", "") }).loadAll().setup();
		this.events = new EventHandler(this, { directory: join(__dirname, "events") }).loadAll();
	}

	public async init() {
		await this.db.auth.static(process.env.DIRECTUS_TOKEN!);
	}
}
