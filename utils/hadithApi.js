const axios = require('axios');

const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

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
  } catch {
    return { eng: null, ara: null };
  }
}

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

async function getHadithDetailed(book, number) {
  const js = await fetchFromJsDelivr(book);
  let engItem = js.eng ? findHadithInCollection(js.eng, number) : null;
  let araItem = js.ara ? findHadithInCollection(js.ara, number) : null;

  return {
    arabic: araItem ? araItem.text || 'Not available' : 'Not available',
    english: engItem ? engItem.text || 'Not available' : 'Not available'
  };
}

module.exports = {
  getHadithDetailed
};
