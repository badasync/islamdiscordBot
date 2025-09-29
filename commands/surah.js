const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const { getSurahAudioUrls, getSurahData } = require('../utils/quranApi');

module.exports = {
  name: 'surah',
  description: 'Play a full Surah in your voice channel. Usage: !surah <surahNumber>',
  async execute(message, args) {
    if (!args[0]) return message.reply('Usage: !surah <surahNumber>');
    if (!message.member.voice.channel) return message.reply('You must join a voice channel first.');

    const surahNum = parseInt(args[0]);
    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
      const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
      connection.subscribe(player);

      const surahData = await getSurahData(surahNum);
      const ayahUrls = await getSurahAudioUrls(surahNum);

      if (!ayahUrls || !ayahUrls.length) return message.reply('No audio available for that surah.');

      let index = 0;
      const playNext = () => {
        if (index >= ayahUrls.length) {
          message.channel.send('✅ Surah finished.');
          connection.destroy();
          return;
        }
        const url = ayahUrls[index++];
        const resource = createAudioResource(url, { inputType: 'arbitrary' });
        player.play(resource);
      };

      player.on('stateChange', (oldState, newState) => {
        if (newState.status === 'idle' && oldState.status !== 'idle') playNext();
      });

      player.on('error', (err) => console.error('Surah player error', err));

      playNext();
      message.channel.send(`📖 Now playing Surah **${surahData.englishName} (${surahData.name})**, number ${surahNum}`);

    } catch (err) {
      console.error('Surah command error:', err);
      message.reply('⚠️ Could not play that surah.');
    }
  }
};
