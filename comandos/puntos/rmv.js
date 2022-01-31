const Discord = require('discord.js');
const client = new Discord.Client();
const {
    Client,
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: "remove",
    alias: [],
    execute(client, message, args) {

        const user = message.member; // user

        let rol = message.guild.roles.cache.find(r => r.name === 'TESORERO SERVER');
        if (!user.roles.cache.has(rol.id)) return message.channel.send(":x:| No puedes utilizar este comando"); // Si el usuario no tiene el rol TESORERO que no pueda usar el comando

        const member = message.mentions.members.first(); // Member
        if (!args[0]) return message.reply("Ingresa la cantidad a remover"); // Cantidad a quitar
        const razon = args.slice(2).join(" ") ? args.slice(2).join(" ") : "Razon sin especificar"; // Damos una razon
        if (isNaN(args[0])) return message.reply("Debes ingresar un numero");
        if (!member) return message.reply("Menciona a alguien");

        client.rmv(member.id, parseInt(args[0])); // Quitamos la cantidad al miembro mencioando

        const embed = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL({
                dynamic: true
            }))
            .setDescription(`:white_check_mark:| Se quitaron <:CIVCOIN:886443353170927658>${args[0].toLocaleString('en-US')} a ${member}`)
            .addField("Razón:", razon)
            .setFooter(`Quitados por: ${message.user.tag}`)
            .setTimestamp()
            .setColor("RED");

        message.channel.send(embed);

    }

}