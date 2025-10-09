# 🌙 Islamic Resource Bot (Quran, Hadith & Nasheed Player)

A comprehensive Islamic resource for your Discord server. This bot allows users to access Quranic verses, Hadith narrations, and stream high-quality recitations and Islamic audio directly in their voice channels. The default command prefix is `!`.

Commands and usage:

| Command | Example | Description |
|---------|---------|-------------|
| `!ayah` | `!ayah 2:255` or `!ayah 2 255` | Fetches and displays a Quranic verse in Arabic & English |
| `!surah` | `!surah 36` | (Voice Channel Required) Plays the full audio recitation of a Surah |
| `!hadith` | `!hadith bukhari 25` | Fetches Arabic & English text of a Hadith with detailed explanation |
| `!play` | `!play <YouTube link>` | (Voice Channel Required) Streams Quran, Nasheeds, or Islamic audio from supported links |
| `!stop` | `!stop` | Stops audio playback and disconnects from the voice channel |
| `!ping` | `!ping` | Checks bot responsiveness |

Installation:

1. Clone the repository:
```bash
git clone https://github.com/badasync/islamdiscordBot.git
cd islamdiscordBot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Discord bot token:
```env
DISCORD_BOT_TOKEN=your-bot-token-here
```

4. Run the bot manually:
```bash
node index.js
```

To run with Docker:

1. Build the Docker image:
```bash
docker build -t islamic-bot .
```

2. Run the container:
```bash
docker run -d --name islamic-bot --env-file .env islamic-bot
```

Requirements: Node.js v16 or higher, Discord.js v14.