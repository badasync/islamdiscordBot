require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

let sodiumReady = false;
try {
  require('sodium-native');
  console.log('✅ sodium-native ready');
  sodiumReady = true;
} catch (err) {
  try {
    require('libsodium-wrappers');
    console.log('✅ libsodium ready');
    sodiumReady = true;
  } catch (err2) {
    console.warn('⚠️ No sodium found, install sodium-native or libsodium-wrappers');
  }
}

if (!sodiumReady) {
  console.error('❌ No encryption library loaded. Please install sodium-native or libsodium-wrappers');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
});

client.commands = new Collection();


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.name && command.execute) {
    client.commands.set(command.name, command);
    console.log(`✅ Loaded command: ${command.name}`);
  } else {
    console.log(`⚠️ Skipped invalid command file: ${file}`);
  }
}


client.once('ready', () => {
  console.log(`🤖 Bot is online! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`${commandName} command error:`, error);
    message.reply('⚠️ حصل خطأ أثناء تنفيذ الأمر');
  }
});

client.login(process.env.DISCORD_TOKEN);
