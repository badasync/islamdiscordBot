const axios = require('axios');

// Open hadith API (JSDelivr mirror)
const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

// Sunnah API (needs API key)
const SUNNAH_API_BASE = 'https://api.sunnah.com/v1';
const SUNNAH_API_KEY = process.env.SUNNAH_API_KEY;

// All available hadith collections
const HADITH_COLLECTIONS = {
  bukhari: 'Sahih al-Bukhari',
  muslim: 'Sahih Muslim',
  abudawud: 'Sunan Abu Dawud',
  tirmidhi: 'Jami at-Tirmidhi',
  nasai: 'Sunan an-Nasai',
  ibnmajah: 'Sunan Ibn Majah',
  malik: 'Muwatta Malik',
  nawawi: 'Forty Hadith of an-Nawawi',
  qudsi: 'Forty Hadith Qudsi',
  dehlawi: 'Forty Hadith of Shah Waliullah Dehlawi'
};

/**
 * Get list of available collections
 */
function getAvailableCollections() {
  return HADITH_COLLECTIONS;
}

/**
 * Check if a collection is valid
 */
function isValidCollection(book) {
  return book && HADITH_COLLECTIONS.hasOwnProperty(book.toLowerCase());
}

/**
 * Get collection full name
 */
function getCollectionName(book) {
  return HADITH_COLLECTIONS[book.toLowerCase()] || book;
}

/**
 * Fetch hadith collections from JSDelivr (English + Arabic)
 */
async function fetchFromJsDelivr(book) {
  try {
    const engUrl = `${JSDELIVR_BASE}/eng-${book}.json`;
    const araUrl = `${JSDELIVR_BASE}/ara-${book}.json`;

    const [engRes, araRes] = await Promise.allSettled([
      axios.get(engUrl, { timeout: 15000 }),
      axios.get(araUrl, { timeout: 15000 })
    ]);

    return {
      eng: engRes.status === 'fulfilled' ? engRes.value.data : null,
      ara: araRes.status === 'fulfilled' ? araRes.value.data : null
    };
  } catch (err) {
    console.error('fetchFromJsDelivr error:', err.message);
    return { eng: null, ara: null };
  }
}

/**
 * Find hadith in a given collection
 */
function findHadithInCollection(collection, number) {
  if (!collection) return null;
  const arrays = [];
  if (Array.isArray(collection.hadiths)) arrays.push(collection.hadiths);
  if (Array.isArray(collection.data)) arrays.push(collection.data);

  for (const arr of arrays) {
    for (const item of arr) {
      const n = item.hadithnumber ?? item.hadithNumber ?? item.number ?? null;
      if (String(n) === String(number)) return item;
    }
  }
  return null;
}

/**
 * Fetch hadith explanation from Sunnah API (if available)
 */
async function fetchHadithExplanation(book, number) {
  if (!SUNNAH_API_KEY) {
    return {
      explanation_ar: 'Not available',
      explanation_en: 'Not available',
      source: 'Unknown'
    };
  }

  try {
    const res = await axios.get(`${SUNNAH_API_BASE}/collections/${book}/hadiths/${number}`, {
      headers: { 'X-API-Key': SUNNAH_API_KEY },
      timeout: 15000
    });

    const hadith = res.data?.hadith?.[0];
    return {
      explanation_ar: hadith?.explanation?.ar || 'Not available',
      explanation_en: hadith?.explanation?.en || 'Not available',
      source: res.data.collection || 'Unknown'
    };
  } catch (err) {
    console.error('fetchHadithExplanation error:', err.message);
    return {
      explanation_ar: 'Not available',
      explanation_en: 'Not available',
      source: 'Unknown'
    };
  }
}

/**
 * Main function to fetch hadith text + explanation
 */
async function getHadithDetailed(book, number) {
  const js = await fetchFromJsDelivr(book);
  const engItem = js.eng ? findHadithInCollection(js.eng, number) : null;
  const araItem = js.ara ? findHadithInCollection(js.ara, number) : null;

  const explanation = await fetchHadithExplanation(book, number);

  return {
    arabic: araItem ? araItem.text || 'Not available' : 'Not available',
    english: engItem ? engItem.text || 'Not available' : 'Not available',
    explanation_ar: explanation.explanation_ar,
    explanation_en: explanation.explanation_en,
    source: explanation.source,
    collectionName: getCollectionName(book)
  };
}

module.exports = {
  getHadithDetailed,
  getAvailableCollections,
  isValidCollection,
  getCollectionName,
  HADITH_COLLECTIONS
};
