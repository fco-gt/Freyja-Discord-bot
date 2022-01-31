const Discord = require('discord.js');
const client = new Discord.Client();
const {
  Client,
  MessageEmbed,
  Collection,
  Guild,
  MessageAttachment
} = require('discord.js');

require('dotenv').config();
const fs = require('fs');
let {
  readdirSync
} = require('fs');

let prefix = '!!';

// Handler

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));
const moderacionCommandFiles = fs.readdirSync('./comandos/moderacion').filter(file => file.endsWith('.js'));
const puntosCommandFiles = fs.readdirSync('./comandos/puntos').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./comandos/${file}`);
  client.commands.set(command.name, command);
}

for (const file of moderacionCommandFiles) {
  const command = require(`./comandos/moderacion/${file}`)
  client.commands.set(command.name, command)
}

for (const file of puntosCommandFiles) {
  const command = require(`./comandos/puntos/${file}`)
  client.commands.set(command.name, command)
}

// Precense

function presence() {
  client.user.setPresence({
    status: 'online',
    activity: {
      name: 'Hijos de Freyja | Roleplay',
      type: 'PLAYING'
    }
  });

}

// Ready
client.on("ready", async () => {
  console.log("Bot listo");
  presence();
});

// Mongoose
require('./db');
const mongoose = require('mongoose');
const schema = require('./models/schema');

// Bienvenida & Log de ingreso
client.on("guildMemberAdd", async member => {

  const canal = member.guild.channels.cache.get("900456260879667250"); // Canal de Log
  const canal2 = member.guild.channels.cache.get("905113675969495040"); // Canal de bien
  const reglas = member.guild.channels.cache.get("890401365715718156"); // Canal de reglas

  const embed1 = new MessageEmbed()
    .setTitle("Nuevo integrante")
    .setDescription(`Bienvenid@ ${member} a **${member.guild.name}**\n\nRecuerda leer las ${reglas}`)
    .setAuthor("Freyja", client.user.avatarURL())
    .setTimestamp()
    .setColor("RANDOM");

  canal.send(`---------------------------------------------\n**Nuevo Usuario:** ${member}\n**Id de Discord:** ${member.id}\n**Tag:** ${member.user.tag}\n---------------------------------------------`);
  canal2.send(embed1);

  member.roles.add("873300839316484187"); // Da al usuario el rol VERIFICAR
});

// Log de salida
client.on("guildMemberRemove", async member => {

  const schema = require('./models/user'); // Llamamos a la base de datos
  const canal = member.guild.channels.cache.get("934506899234246686"); // Canal de Log

  const info = await schema.findOne({
    id: member.id
  }, async (err, data) => { // Buscamos la ID de steam del usuario 
    if (err) throw err;
    if (data) { // Si tiene la ID de steam que la muestre en el Log
      const steam_id = data.steam_id;
      canal.send(`---------------------------------------------\n**Se fue un usuario:** ${member.user.username}\n**Id de Discord:** ${member.id}\n**Tag:** ${member.user.tag}\n**Steam ID:** ${steam_id}\n---------------------------------------------`)
    } else { // Si no tiene la ID de steam que nos muestre solo la informacion del usuario
      canal.send(`---------------------------------------------\n**Se fue un usuario:** ${member.user.username}\n**Id de Discord:** ${member.id}\n**Tag:** ${member.user.tag}\n---------------------------------------------`)
    }
  })
});

// Mensaje privado al unirse
client.on("guildMemberAdd", async user => {
  let embed = new Discord.MessageEmbed()
    .setTitle(`Bienvenid@ a ${user.guild.name}`)
    .setColor("0x00AE86")
    .setDescription(`Hola, Bienvenid@ al servidor de ValheimRoleplay "${user.guild.name}" espero la pasemos muy bien, te invito a leer las reglas para que no tengas ningun problema :D`)
    .setAuthor("Freyja Bot")
    .setThumbnail(client.user.avatarURL())
    .addField('White List', `Una vez verificado, deberas dejar tu steam Id en Whitelist (leer las reglas para mas información)`)
    .setFooter('Bot Desarrollado por Mankeke#9299 | Dev Mankekito Bot')
  user.send(embed).catch(error => {
    console.log(error);
  }) // Enviamos el embed al usuario

});

// Snipe
client.snipes = new Map()

// Evento message
client.on('message', async message => {
  if (message.author.bot) return; // Si el autor del mensaje es un bot que retorne
  if (!message.content.startsWith(prefix)) return; // Si no contiene el prefijo que retorne

  let usuario = message.mentions.members.first() || message.member; // member
  const args = message.content.slice(prefix.length).trim().split(/ +/g); // args
  const command = args.shift().toLowerCase(); // command

  // Command handler
  let cmd = client.commands.find(
    c => c.name === command || (c.alias && c.alias.includes(command))
  );
  if (cmd) {
    cmd.execute(client, message, args);
  }
});


// Snipe message
client.on('messageDelete', message => {
  client.snipes.set(message.channel.id, {
    content: message.content,
    delete: message.author,
    canal: message.channel
  })
})

// Funciones para los Freycoins (puntos)

// Balance del usuario
client.bal = (id) => new Promise(async ful => {
  const data = await schema.findOne({
    id
  });
  if (!data) return ful(0);
  ful(data.coins);
})

// Agregar
client.add = (id, coins) => {
  schema.findOne({
    id
  }, async (err, data) => {
    if (err) throw err;
    if (data) {
      data.coins += coins;
    } else {
      data = new schema({
        id,
        coins
      })
    }
    data.save();
  })
}

// Quitar
client.rmv = (id, coins) => {
  schema.findOne({
    id
  }, async (err, data) => {
    if (err) throw err;
    if (data) {
      data.coins -= coins;
    } else {
      data = new schema({
        id,
        coins: -coins
      })
    }
    data.save();
  })
}

client.login(process.env.token);