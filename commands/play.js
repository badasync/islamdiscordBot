const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const playdl = require('play-dl');

module.exports = {
  name: 'play',
  description: 'Play audio from YouTube link. Usage: !play <url>',
  async execute(message, args) {
    if (!args[0]) {
      return message.reply('❌ لازم تديني لينك YouTube.');
    }

    const url = args[0];
    if (!playdl.yt_validate(url)) {
      return message.reply('⚠️ اللينك مش صحيح أو مش مدعوم.');
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('🎤 خش أي voice channel الأول.');
    }

    try {
      // Join VC
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      // Get audio stream
      const stream = await playdl.stream(url);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });

      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      });

      player.on(AudioPlayerStatus.Playing, () => {
        console.log('▶️ الصوت شغال');
      });

      player.on('error', error => {
        console.error('❌ Error in player:', error);
        message.channel.send('⚠️ حصل خطأ أثناء تشغيل الصوت.');
      });

      connection.subscribe(player);
      player.play(resource);

      await message.reply(`🎶 شغال دلوقتي: ${url}`);
    } catch (err) {
      console.error('Play command error:', err);
      message.reply('⚠️ حصل خطأ في تشغيل الصوت.');
    }
  },
};
