import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'url';
import { ChatInputCommandFile } from './typings';

config();

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = new Collection<string, ChatInputCommandFile>()
const commandsPath = join(__dirname, 'commands');
const commandFiles = await readdir(commandsPath)

for (const file of commandFiles.filter(file => file.endsWith('.js'))) {
	const command = await import(`./commands/${file}`);
	const json = command.data.toJSON();
	commands.set(json.name, command);
}

client.on(Events.ClientReady, () => {
	console.log('Ready');
});

client.on(Events.InteractionCreate, async interaction => {
	if(!interaction.isChatInputCommand()) return;

	const command = commands.get(interaction.commandName);
	if(!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

client.login();