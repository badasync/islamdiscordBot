const fetch = require('node-fetch');

const BASE = 'https://api.alquran.cloud/v1';
const AUDIO_ED = process.env.QURAN_AUDIO_EDITION || 'ar.alafasy';
const TEXT_ED = 'quran-uthmani';
const TRANSLATION_ED = process.env.QURAN_TRANSLATION || 'en.asad';

// New tafsir source: spa5k Tafsir API via jsDelivr
const TAFSIR_JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';

/**
 * Get ayah text (Arabic + translation)
 */
async function getAyahText(refOrSurah, maybeAyah) {
  try {
    const ref = maybeAyah ? `${refOrSurah}:${maybeAyah}` : refOrSurah;

    const arRes = await fetch(`${BASE}/ayah/${encodeURIComponent(ref)}/${TEXT_ED}`);
    const arJson = await arRes.json();
    if (arJson.status !== 'OK') throw new Error('Ayah not found');

    const trRes = await fetch(`${BASE}/ayah/${encodeURIComponent(ref)}/${TRANSLATION_ED}`);
    const trJson = await trRes.json();

    return {
      arabic: arJson.data.text,
      translation: trJson && trJson.status === 'OK' ? trJson.data.text : null
    };
  } catch (err) {
    console.error('getAyahText error:', err.message);
    throw err;
  }
}

/**
 * Get tafsir (Arabic + English) using spa5k tafsir_api
 */
async function getAyahTafsir(surah, ayah) {
  try {
    // editionSlug examples: "ar-tafseer-al-jalalayn", "en-tafseer-ibn-kathir"
    // we try a default Arabic tafsir + default English tafsir
    const arabicSlug = 'ar-tafseer-al-jalalayn';
    const englishSlug = 'en-tafseer-ibn-kathir';

    // Arabic tafsir
    const arUrl = `${TAFSIR_JSDELIVR_BASE}/${arabicSlug}/${surah}/${ayah}.json`;
    const arRes = await fetch(arUrl);
    const arJson = await arRes.json();
    const tafsirAr = arJson?.text || 'Not available';

    // English tafsir
    let tafsirEn = 'Not available';
    try {
      const enUrl = `${TAFSIR_JSDELIVR_BASE}/${englishSlug}/${surah}/${ayah}.json`;
      const enRes = await fetch(enUrl);
      const enJson = await enRes.json();
      tafsirEn = enJson?.text || 'Not available';
    } catch {
      tafsirEn = 'Not available';
    }

    return { arabic: tafsirAr, english: tafsirEn };
  } catch (err) {
    console.error('getAyahTafsir error:', err.message);
    return { arabic: null, english: null };
  }
}

/**
 * Get audio for single ayah
 */
async function getAyahAudio(refOrSurah, maybeAyah) {
  try {
    const ref = maybeAyah ? `${refOrSurah}:${maybeAyah}` : refOrSurah;
    const res = await fetch(`${BASE}/ayah/${encodeURIComponent(ref)}/${AUDIO_ED}`);
    const json = await res.json();
    if (json.status !== 'OK' || !json.data.audio) throw new Error('Ayah audio not found');
    return json.data.audio;
  } catch (err) {
    console.error('getAyahAudio error:', err.message);
    throw err;
  }
}

/**
 * Get array of audio URLs for entire surah
 */
async function getSurahAudioUrls(surahNumber) {
  try {
    const res = await fetch(`${BASE}/surah/${encodeURIComponent(surahNumber)}/${AUDIO_ED}`);
    const json = await res.json();
    if (json.status !== 'OK' || !json.data.ayahs) throw new Error('Surah audio not found');

    const urls = json.data.ayahs.map(a => a.audio).filter(u => typeof u === 'string' && u.length > 0);
    if (!urls.length) throw new Error('No audio available for this surah');
    return urls;
  } catch (err) {
    console.error(`getSurahAudioUrls error for Surah ${surahNumber}:`, err.message);
    return [];
  }
}

module.exports = {
  getAyahText,
  getAyahTafsir,
  getAyahAudio,
  getSurahAudioUrls
};
