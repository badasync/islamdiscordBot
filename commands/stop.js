const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'stop',
  description: 'Stop playback and leave voice channel',
  async execute(message) {
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) return message.reply('I am not connected to a voice channel.');
    try {
      connection.destroy();
      message.reply('🛑 Stopped and left the voice channel.');
    } catch (err) {
      console.error('Stop command error', err);
      message.reply('⚠️ Could not leave the voice channel.');
    }
  }
};
