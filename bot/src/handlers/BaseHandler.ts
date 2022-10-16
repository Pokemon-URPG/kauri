import { Collection } from 'discord.js';
import { readdirSync, statSync } from 'fs';
import { pathToFileURL } from 'node:url';
import { extname, join, resolve } from 'path';
import type { KauriClient } from '../client/KauriClient';
import { Module } from '../typings';

export interface BaseHandlerOptions {
	directory: string;
	extensions?: string[];
	loadFilter?: (...args: any) => boolean;
}

/**
 * Module handler heavily inspired by (basically just modified from) Akairo
 * Credit to {@link https://github.com/discord-akairo/discord-akairo}
 */
export abstract class BaseHandler<T extends Module = Module> {
	protected client: KauriClient;
	protected directory = './';
	protected extensions = new Set(['.js', '.json']);
	public modules: Collection<string, T>;

	public constructor(client: KauriClient, options: BaseHandlerOptions) {
		this.client = client;
		if (options.extensions) this.extensions = new Set(options.extensions);
		this.directory = options.directory;
		this.modules = new Collection<string, T>();
	}

	protected register(module: T): this {
		this.modules.set(module.data.name, module);

		return this;
	}

	public async load(path: string): Promise<this> {
		if (!this.extensions.has(extname(path))) {
			return this;
		}

		const _module = await import(pathToFileURL(path).toString());
		if (!_module.data || !_module.execute) return this;

		this.register(_module);

		return this;
	}

	public loadAll(directory = this.directory): this {
		const files = BaseHandler.readdirRecursive(directory);
		for (const file of files) {
			this.load(resolve(file));
		}

		return this;
	}

	// public reload(id: string): T | void {

	// }

	// public reloadAll(): this {

	// }

	// public remove(id: string): T {
	// }

	// public removeAll(): this {

	// }

	// private isModuleType(item: T): boolean {
	// 	return item && (item instanceof this.classToLoad);
	// }

	public static async getDeploymentData(directory: string, extensions: Set<string> = new Set(['.js', '.json'])) {
		const files = BaseHandler.readdirRecursive(directory);
		const data = [];
		for (const file of files) {
			if (extensions.has(extname(file))) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const module = await import(file);
				if (!module.data) continue;
				data.push(module.data);
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return data;
	}

	public static readdirRecursive(directory: string): string[] {
		const result: string[] = [];

		const read = (dir: string) => {
			const files = readdirSync(dir);

			for (const file of files) {
				const filepath = join(dir, file);

				if (statSync(filepath).isDirectory()) {
					read(filepath);
				} else {
					result.push(filepath);
				}
			}
		};

		read(directory);

		return result;
	}
}

