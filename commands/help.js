module.exports = {
  name: 'help',
  description: 'Show all available commands',
  async execute(message, args) {
    const commands = message.client.commands;

    const helpText = `
**Available Commands:**

**Quran:**
• \`!ayah <surah>:<ayah>\` - Get verse with translation and tafsir
• \`!surah <number>\` - Play full surah audio in voice channel
• \`!play <surah>:<ayah>\` - Play ayah audio in voice channel

**Hadith:**
• \`!hadith <book> <number>\` - Get hadith text and explanation
• \`!hadith list\` - Show all available hadith collections

**Audio:**
• \`!stop\` - Stop playback and disconnect from voice channel

**Other:**
• \`!ping\` - Check bot responsiveness
• \`!help\` - Show this message

**Examples:**
\`!ayah 2:255\` - Ayat Al-Kursi
\`!surah 36\` - Play Surah Ya-Sin
\`!hadith bukhari 1\` - First hadith in Sahih al-Bukhari
    `;

    await message.reply(helpText);
  }
};
