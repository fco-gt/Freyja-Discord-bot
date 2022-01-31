const Discord = require('discord.js');
const client = new Discord.Client();
const {
    Client,
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: "add",
    alias: ["agregar"],
    execute(client, message, args) {

        const usuario = message.member; // Usuario

        let rol = message.guild.roles.cache.find(r => r.name === 'TESORERO SERVER');
        if (!usuario.roles.cache.has(rol.id)) return message.channel.send(":x:| No puedes utilizar este comando"); // Si el usuario no tiene el rol TESORERO que no pueda usar el comando

        const freycoins = args[0]; // Cantidad de freycoins
        const razon = args.slice(2).join(" ") ? args.slice(2).join(" ") : "Razon sin especificar"; // Razon
        const member = message.mentions.members.first() || client.users.cache.get(args[0]); // Usuario a dar

        if (!freycoins) return message.reply("Ingresa la cantidad a agregar");
        if (!member) return message.reply("Debes mencionar a alguien");
        if (isNaN(freycoins)) return message.reply("Debes ingresar un **numero** a dar");

        client.add(member.id, parseInt(freycoins)); // Agregamos los puntos al usuario

        const embed = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL({
                dynamic: true
            }))
            .setDescription(`:white_check_mark:| Se agregaron <:CIVCOIN:886443353170927658>${freycoins.toLocaleString('en-US')} a ${member}`)
            .addField("Razón:", razon)
            .setFooter(`Agregados por: ${message.usuario.tag}`)
            .setTimestamp()
            .setColor("GREEN");

        message.channel.send(embed);

    }

}