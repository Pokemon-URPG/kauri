import { GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { KauriClient } from './client/KauriClient.js';

config();

global.__dirname = fileURLToPath(new URL('.', import.meta.url));


const client = new KauriClient({ intents: [GatewayIntentBits.Guilds ]});

client.login();