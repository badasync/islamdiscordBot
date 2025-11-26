const { getHadithDetailed, HADITH_COLLECTIONS } = require('../utils/hadithApi');

// Approximate hadith counts for random selection
const HADITH_COUNTS = {
  bukhari: 7563,
  muslim: 3033,
  abudawud: 5274,
  tirmidhi: 3956,
  nasai: 5758,
  ibnmajah: 4341,
  malik: 1594,
  nawawi: 42,
  qudsi: 40,
  dehlawi: 40
};

module.exports = {
  name: 'randomhadith',
  description: 'Get a random hadith. Usage: !randomhadith or !randomhadith bukhari',
  async execute(message, args) {
    let book;
    let maxNumber;

    if (args.length > 0 && HADITH_COLLECTIONS[args[0].toLowerCase()]) {
      // User specified a collection
      book = args[0].toLowerCase();
      maxNumber = HADITH_COUNTS[book];
    } else {
      // Pick random collection
      const collections = Object.keys(HADITH_COLLECTIONS);
      book = collections[Math.floor(Math.random() * collections.length)];
      maxNumber = HADITH_COUNTS[book];
    }

    const number = Math.floor(Math.random() * maxNumber) + 1;

    try {
      await message.reply(`Fetching random hadith from **${HADITH_COLLECTIONS[book]}**...`);

      const info = await getHadithDetailed(book, number);

      if (!info || (info.arabic === 'Not available' && info.english === 'Not available')) {
        // Try again with a different number if not found
        const retryNumber = Math.floor(Math.random() * Math.min(100, maxNumber)) + 1;
        const retryInfo = await getHadithDetailed(book, retryNumber);

        if (!retryInfo || (retryInfo.arabic === 'Not available' && retryInfo.english === 'Not available')) {
          return message.channel.send(`Could not find a random hadith. Try again or use \`!hadith ${book} <number>\``);
        }

        return sendHadith(message, book, retryNumber, retryInfo);
      }

      await sendHadith(message, book, number, info);
    } catch (err) {
      console.error('Random hadith error:', err);
      message.reply('Could not fetch random hadith. Please try again.');
    }
  }
};

async function sendHadith(message, book, number, info) {
  const out = `
**${info.collectionName}** - Hadith #${number}

**Arabic:**
${info.arabic}

**English:**
${info.english}
  `;

  for (const chunk of out.match(/[\s\S]{1,1900}/g)) {
    await message.channel.send(chunk);
  }
}
