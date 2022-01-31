const Discord = require('discord.js');
const client = new Discord.Client();
const {
    Client,
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: "bal",
    alias: ["balance"],
    async execute(client, message, args) {

        let usuario = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author; // Usuario

        const bal = await client.bal(usuario.id); // Obtenemos el balance del usuario
        const balance = bal.toLocaleString('en-US'); // Lo convertimos

        const embed = new MessageEmbed()
            .setAuthor(usuario.tag, usuario.displayAvatarURL())
            .setTitle(`Informacion de ${usuario.username}`)
            .addField(`Freycoins:`, `<:CIVCOIN:886443353170927658>${balance}`, true)
            .setThumbnail(usuario.displayAvatarURL({
                dynamic: true
            }))
            .setColor(`CivCoin System | CivHeim`)
            .setColor("RANDOM")

        message.channel.send(embed)

    }

}