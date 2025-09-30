// commands/hadith.js
const { getHadithDetailed } = require('../utils/hadithApi');

module.exports = {
  name: 'hadith',
  description: 'Fetch a hadith by book and number',
  usage: '!hadith <book> <number>',
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply('❌ usage: !hadith <book> <number>\nexample: !hadith bukhari 25');
    }

    const book = args[0].toLowerCase();
    const number = args[1];
 
    try {
      const info = await getHadithDetailed(book, number);
      if (!info) return message.reply(`⚠️ Hadith #${number} not found in ${book}.`);

      const out = `
📖 ${book.charAt(0).toUpperCase() + book.slice(1)} #${number}

Arabic:
${info.arabic}

English:
${info.english}

Explanation Arabic:
${info.expl_ar || 'Not available'}

Explanation English:
${info.expl_en || 'Not available'}

Source: ${book.charAt(0).toUpperCase() + book.slice(1)} #${number}
      `;

      for (const chunk of out.match(/[\s\S]{1,1900}/g)) {
        await message.channel.send(chunk);
      }
    } catch (err) {
      console.error('Hadith command error', err);
      message.reply('❌ Could not fetch that hadith.');
    }
  }
};
