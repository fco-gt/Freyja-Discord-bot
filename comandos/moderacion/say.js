const Discord = require('discord.js');
const client = new Discord.Client();
const {
  Client,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: "say",
  alias: [],
  execute(client, message, args) {

    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.channel.send('No tienes permiso para usar este comando `ADMINISTRATOR`').then(m => {
        m.delete({
          timeout: 3000
        });
      })
    }

    if (!args) return message.channel.send(`:x:| Debes escribir un mensaje a enviar.`);
    message.channel.send(args.join(" "));
    message.delete();
  }

}