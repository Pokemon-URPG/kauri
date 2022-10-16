import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

config();

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const commands = [];
const commandFiles = await readdir(join(__dirname, 'commands'));

// Place your client and guild ids here
const clientId = '947736008064110642';
const guildId = '135864828240592896';

for (const file of commandFiles.filter(file => file.endsWith('.js'))) {
	const command = await import(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		) as unknown[];

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
