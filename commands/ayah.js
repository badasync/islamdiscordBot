const { getAyahText } = require('../utils/quranApi');

module.exports = {
  name: 'ayah',
  description: 'Get ayah text. Usage: !ayah 2:255 or !ayah 2 255',
  async execute(message, args) {
    if (!args.length) {
      return message.reply('Usage: !ayah 2:255 or !ayah 2 255');
    }

    let surah, ayah;
    if (args.length === 1 && args[0].includes(':')) {
      [surah, ayah] = args[0].split(':');
    } else if (args.length >= 2) {
      surah = args[0];
      ayah = args[1];
    } else {
      return message.reply('Usage: !ayah 2:255 or !ayah 2 255');
    }

    try {
      const data = await getAyahText(surah, ayah);

      if (!data || (!data.arabic && !data.translation)) {
        return message.reply('⚠️ Could not fetch that ayah.');
      }

      // Make sure data is a single object (not an array)
      const arabic = Array.isArray(data.arabic) ? data.arabic.join(' ') : data.arabic;
      const translation = Array.isArray(data.translation) ? data.translation.join(' ') : data.translation;

      const ref = `${surah}:${ayah}`;

      // Send ONE message only
      await message.channel.send(`**${ref} — Arabic:**\n${arabic}\n\n**${ref} — Translation:**\n${translation}`);
    } catch (err) {
      console.error('Ayah command error:', err);
      message.reply('⚠️ Could not fetch that ayah. Make sure the reference is correct.');
    }
  }
};
