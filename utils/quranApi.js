const fetch = require('node-fetch');

const BASE = 'https://api.alquran.cloud/v1';
const AUDIO_ED = process.env.QURAN_AUDIO_EDITION || 'ar.alafasy';
const TEXT_ED = 'quran-uthmani';
const TRANSLATION_ED = process.env.QURAN_TRANSLATION || 'en.asad';

/**
 * Get ayah text (Arabic + translation) by reference
 * Accepts "2:255" or (surah, ayah) pairs.
 */
async function getAyahText(refOrSurah, maybeAyah) {
  try {
    let ref = maybeAyah ? `${refOrSurah}:${maybeAyah}` : refOrSurah;

    // Arabic
    const arRes = await fetch(`${BASE}/ayah/${encodeURIComponent(ref)}/${TEXT_ED}`);
    const arJson = await arRes.json();
    if (arJson.status !== 'OK') throw new Error('Ayah not found');

    // Translation
    const trRes = await fetch(`${BASE}/ayah/${encodeURIComponent(ref)}/${TRANSLATION_ED}`);
    const trJson = await trRes.json();

    return {
      arabic: arJson.data.text,
      arabicMeta: arJson.data,
      translation: trJson && trJson.status === 'OK' ? trJson.data.text : null
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Get the audio URL for a single ayah
 */
async function getAyahAudio(refOrSurah, maybeAyah) {
  try {
    const ref = maybeAyah ? `${refOrSurah}:${maybeAyah}` : refOrSurah;
    const res = await fetch(`${BASE}/ayah/${encodeURIComponent(ref)}/${AUDIO_ED}`);
    const json = await res.json();
    if (json.status !== 'OK' || !json.data.audio) throw new Error('Ayah audio not found');
    return json.data.audio;
  } catch (err) {
    throw err;
  }
}

/**
 * Get array of audio URLs for entire surah by number
 */
async function getSurahAudioUrls(surahNumber) {
  try {
    const res = await fetch(`${BASE}/surah/${encodeURIComponent(surahNumber)}/${AUDIO_ED}`);
    const json = await res.json();
    if (json.status !== 'OK' || !json.data.ayahs) throw new Error('Surah audio not found');

    // Return array of ayah audio URLs, filter out null/undefined
    const urls = json.data.ayahs.map(a => a.audio).filter(u => typeof u === 'string' && u.length > 0);

    if (!urls.length) throw new Error('No audio available for this surah');
    return urls;
  } catch (err) {
    console.error(`getSurahAudioUrls error for Surah ${surahNumber}:`, err.message);
    return [];
  }
}

/**
 * Get surah text (metadata + ayahs)
 */
async function getSurahData(surahNumber) {
  try {
    const res = await fetch(`${BASE}/surah/${encodeURIComponent(surahNumber)}/${TEXT_ED}`);
    const json = await res.json();
    if (json.status !== 'OK') throw new Error('Surah text not found');
    return json.data;
  } catch (err) {
    console.error(`getSurahData error for Surah ${surahNumber}:`, err.message);
    return null;
  }
}

module.exports = {
  getAyahText,
  getAyahAudio,
  getSurahAudioUrls,
  getSurahData
};
