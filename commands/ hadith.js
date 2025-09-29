const { getHadithDetailed } = require('../utils/hadithApi');

module.exports = {
  name: 'hadith',
  description: 'Fetch a hadith with chain and narrator info (best-effort)',
  usage: '!hadith <book> <number>',
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply('❌ usage: !hadith <book> <number>\nexample: !hadith bukhari 25');
    }

    const book = args[0].toLowerCase();
    const number = args[1];

    try {
      await message.channel.send(`🔎 Searching for ${book} #${number}...`);
      const info = await getHadithDetailed(book, number);
      if (!info) return message.reply(`⚠️ Hadith #${number} not found or no data available for ${book}.`);

      // build output (split into manageable chunks)
      const parts = [];
      parts.push(`📖 ${capitalize(book)} #${number}`);
      parts.push(`\nArabic:\n${info.arabic || '❌ Not available'}`);
      parts.push(`\nEnglish:\n${info.english || '❌ Not available'}`);
      parts.push(`\nIsnad (chain):\n${Array.isArray(info.isnad) ? info.isnad.join(' > ') : (info.isnad || '❌ Not available')}`);
      parts.push(`\nNarrators (best-effort list):\n${Array.isArray(info.narrators) ? info.narrators.join(' → ') : (info.narrators || '❌ Not available')}`);
      parts.push(`\nGrade / classification (if available):\n${info.grade || '❌ Not available'}`);
      parts.push(`\nNotes (if any):\n${info.notes || '❌ None'}`);
      parts.push(`\nNarrator integrity (adalah):\n${info.narratorIntegrity || '❌ Not available'}`);
      parts.push(`\nNarrator accuracy (dhabt):\n${info.narratorAccuracy || '❌ Not available'}`);
      parts.push(`\nFree from contradictions (shudhudh)?:\n${info.shudhudh || '❌ Not specified'}`);
      parts.push(`\nFree from hidden defects (illah)?:\n${info.illah || '❌ Not specified'}`);
      parts.push(`\nData sources checked: ${Array.isArray(info.sources) ? info.sources.join(', ') : (info.sources || 'none')}`);

      const out = parts.join('\n');

      // send in chunks of 1900 chars
      for (const chunk of out.match(/[\s\S]{1,1900}/g)) {
        await message.channel.send(chunk);
      }
    } catch (err) {
      console.error('Hadith command error', err);
      message.reply('❌ Could not fetch that hadith (internal error).');
    }
  }
};

function capitalize(s) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}
