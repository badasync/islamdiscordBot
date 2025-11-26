// commands/hadith.js
const { getHadithDetailed, isValidCollection, HADITH_COLLECTIONS } = require('../utils/hadithApi');

module.exports = {
  name: 'hadith',
  description: 'Fetch a hadith by book and number',
  usage: '!hadith <book> <number>',
  async execute(message, args) {
    // Show available collections if no args or just "list"
    if (args.length === 0 || args[0].toLowerCase() === 'list') {
      const collectionsList = Object.entries(HADITH_COLLECTIONS)
        .map(([key, name]) => `• **${key}** - ${name}`)
        .join('\n');

      return message.reply(`📚 **Available Hadith Collections:**\n${collectionsList}\n\nUsage: \`!hadith <book> <number>\`\nExample: \`!hadith bukhari 1\``);
    }

    if (args.length < 2) {
      return message.reply('Usage: `!hadith <book> <number>`\nExample: `!hadith muslim 1`\nType `!hadith list` to see all collections.');
    }

    const book = args[0].toLowerCase();
    const number = args[1];

    // Validate collection
    if (!isValidCollection(book)) {
      const validBooks = Object.keys(HADITH_COLLECTIONS).join(', ');
      return message.reply(`Unknown collection "${book}".\nAvailable: ${validBooks}\nType \`!hadith list\` for details.`);
    }

    try {
      const info = await getHadithDetailed(book, number);
      if (!info || (info.arabic === 'Not available' && info.english === 'Not available')) {
        return message.reply(`Hadith #${number} not found in ${info.collectionName}.`);
      }

      const out = `
📖 **${info.collectionName}** - Hadith #${number}

**Arabic:**
${info.arabic}

**English:**
${info.english}

**Explanation (Arabic):**
${info.explanation_ar || 'Not available'}

**Explanation (English):**
${info.explanation_en || 'Not available'}
      `;

      // Split long messages
      for (const chunk of out.match(/[\s\S]{1,1900}/g)) {
        await message.channel.send(chunk);
      }
    } catch (err) {
      console.error('Hadith command error', err);
      message.reply('Could not fetch that hadith.');
    }
  }
};
