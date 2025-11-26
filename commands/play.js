const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const { getAyahAudio } = require('../utils/quranApi');

module.exports = {
  name: 'play',
  description: 'Play Quran ayah audio. Usage: !play 2:255 or !play 2 255',
  async execute(message, args) {
    if (!args.length) {
      return message.reply('Usage: !play 2:255 or !play 2 255');
    }

    let surah, ayah;
    if (args.length === 1 && args[0].includes(':')) {
      [surah, ayah] = args[0].split(':');
    } else if (args.length >= 2) {
      surah = args[0];
      ayah = args[1];
    } else {
      return message.reply('Usage: !play 2:255 or !play 2 255');
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('🎤 You must join a voice channel first.');
    }

    try {
      const audioUrl = await getAyahAudio(surah, ayah);
      if (!audioUrl) {
        return message.reply('⚠️ Could not find audio for that ayah.');
      }

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      const resource = createAudioResource(audioUrl, { inputType: 'arbitrary' });

      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      });

      player.on(AudioPlayerStatus.Playing, () => {
        console.log(`▶️ Playing Ayah ${surah}:${ayah}`);
      });

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

      player.on('error', error => {
        console.error('❌ Error in player:', error);
        message.channel.send('⚠️ Error playing audio.');
      });

      connection.subscribe(player);
      player.play(resource);

      await message.reply(`📖 Now playing Ayah ${surah}:${ayah}`);
    } catch (err) {
      console.error('Play command error:', err);
      message.reply('⚠️ Could not play that ayah.');
    }
  },
};
