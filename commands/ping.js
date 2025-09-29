module.exports = {
  name: 'ping',
  description: 'Ping test',
  async execute(message) {
    await message.reply('🏓 Pong!');
  }
};
