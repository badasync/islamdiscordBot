# 🌙 Islamic Resource Bot (Quran, Hadith & Nasheed Player)

A comprehensive Islamic resource for your Discord server. This bot allows users to access Quranic verses, Hadith narrations, and stream high-quality recitations and Islamic audio directly in their voice channels.

---

## Features

- **Quran Verses:** Fetch any verse in Arabic and English (default translation: Asad).  
- **Hadiths:** Get detailed Hadith narrations with explanations from authentic books.  
- **Audio Playback:** Stream full Surahs, recitations, or Nasheeds in your voice channel.  
- **Simple Commands:** User-friendly commands for instant access to Islamic content.  

---

## Command Prefix

The default command prefix is: `!`

---

## Command Usage Guide

| Command   | Example             | Description |
|-----------|---------------------|-------------|
| `!ayah`   | `!ayah 2:255` or `!ayah 2 255` | Fetches and displays a Quranic verse in Arabic & English |
| `!surah`  | `!surah 36`         | *(Voice Channel Required)* Plays the full audio recitation of a Surah |
| `!hadith` | `!hadith bukhari 25`| Fetches Arabic & English text of a Hadith with detailed explanation |
| `!play`   | `!play <YouTube link>` | *(Voice Channel Required)* Streams Quran, Nasheeds, or Islamic audio from supported links |
| `!stop`   | `!stop`             | Stops audio playback and disconnects from the voice channel |
| `!ping`   | `!ping`             | Checks bot responsiveness |

---

## Installation

1. **Clone the repository:**
   ```bash
   git clon https://github.com/badasync/islamdiscordBot.git
   cd islamic-resource-bot

2. **Install dependencies:
npm install
3. **Create a `.env` file in the root directory and add your Discord bot token:**
   ```
   DISCORD_BOT_TOKEN=your-bot-token-here
   ```bash
   4. **Run the bot:**
   ```bash  
   node index.js

   ```
   Requirements   
     Node.js v16 or higher

    Discord.js v14

    Internet connection for audio streaming
