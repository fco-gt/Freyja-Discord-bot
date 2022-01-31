const Discord = require('discord.js');
const client = new Discord.Client();
const {
  Client,
  MessageEmbed
} = require('discord.js');

const schema = require('../../models/user'); // Schema

module.exports = {
  name: "verificar",
  alias: [],
  async execute(client, message, args) {

    // Permissions
    if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
      return message.channel.send(':x:| No tengo permisos! `MANAGE_ROLES`');
    }

    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.channel.send(':x:| Alto ahi, este comando solo lo pueden utilizar los administradores');
    }

    // Verifi
    const verifi_rol = message.guild.roles.resolve("873300839316484187"); // Rol VERIFICAR
    const member_rol = message.guild.roles.resolve("818581503516344381"); // Rol MIEMBRO
    const member = message.mentions.members.first(); // Usuario

    // Channel
    const rules = message.guild.channels.cache.get("890401365715718156"); // Canal de reglas
    const acces = message.guild.channels.cache.get("904752068600934470"); // Canal de acceso
    const general = message.guild.channels.cache.get("878462803705471047"); // Canal general

    // DB
    const steam_id = args.slice(1).join(' '); // ID de steam

    // Embed
    const embed = new MessageEmbed()
      .setTitle("Usuario verificado")
      .setDescription(`Bienvenido, lee ${rules} para evitar hacer preguntas que tienen respuesta escrita. Descarga desde ${acces} el contenido siguiendo instrucciones y si tienes alguna duda usa los canales de voz o ${general}.`)
      .addField("Importante", "- No mandar mensajes directos a los administradores.\n- Cambiar el apodo de Discord por el nombre del jugador")
      .setColor("GREEN")
      .setTimestamp()
      .setFooter("ATT: Freyja Staff");

    // Member
    if (!member) return message.channel.send(":x:| Debes mencionar al usuario a verficiar"); // Por si no se menciono al usuario

    // Upload to DB
    await schema.findOne({
      id: member.id
    }, async (err, data) => { // Buscamos al usuario en la base de datos
      if (err) throw err;
      if (data) { // Si el usuario ya estaba verificado anteriormente lo volveremos a verificar (remplazando la antiga ID por la que se haya otorgado)
        schema.findOneAndDelete({
          id: member.id
        })
        data = new schema({
          id: member.id,
          username: member.user.username,
          steam_id: steam_id
        })
        message.reply(`:white_check_mark:| Se ha vuelto a verificar a ${member} con exito`);
      } else { // Si el usuario es nuevo crearemos un nuevo archivo que tendra: ID de discord | Username | Steam ID
        data = new schema({
          id: member.id,
          username: member.user.username,
          steam_id: steam_id
        })
        data.save() // Guardamos
        message.reply(`:white_check_mark:| Se ha verificado a ${member} con exito`);
      }
    }).catch(err => {
      console.log(err);
    });

    // Verification
    member.roles.add(member_rol); // Le damos el rol MIEMBRO
    member.roles.remove(verifi_rol); // Le quitamos el rol VERIFICAR

    member.send(embed).catch(err => { // Se le envia el embed al DM del usuario
      console.log(err);
    });

  }

}