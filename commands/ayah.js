const { getAyahText, getAyahTafsir } = require('../utils/quranApi');

module.exports = {
  name: 'ayah',
  description: 'Get ayah with translation and tafsir. Usage: !ayah 2:255',
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
      const tafsir = await getAyahTafsir(surah, ayah);

      if (!data || (!data.arabic && !data.translation)) {
        return message.reply('⚠️ Could not fetch that ayah.');
      }

      const ref = `${surah}:${ayah}`;
      const output = `
📖 Ayah ${ref}

Arabic:
${data.arabic}

English Translation:
${data.translation}

Tafsir Arabic:
${tafsir.arabic || 'Not available'}

Tafsir English:
${tafsir.english || 'Not available'}
      `;

      await message.channel.send(output);
    } catch (err) {
      console.error('Ayah command error:', err);
      message.reply('⚠️ Could not fetch ayah or tafsir.');
    }
  }
};
