const Discord = require('discord.js');
const client = new Discord.Client();
const {
    Client,
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: "trade",
    alias: ["give"],
    async execute(client, message, args) {

        const channel = message.guild.channels.cache.get("890695779151380501");
        if (message.channel.id !== channel.id) return message.channel.send(`:x:| Porfavor utiliza el comando en ${channel}`); // Si el canal no es el correcto que retorne

        const user = message.mentions.users.first(); // User
        if (!user || user.id === message.author.id) return message.reply(":x:| Debes mencionar a quien le daras los Freycoins");

        const coinsToDonate = args[1]; // Cantidad de puntos a tradear
        if (!coinsToDonate) return message.reply(":x:| Ingresa el monto a dar");

        if (isNaN(coinsToDonate))
            return message.reply(":x:| Debes ingresar un **numero**"); // Si la cantidad no es un numero que retorne

        const convertedDonation = parseInt(coinsToDonate); // Convertimos la cantidad
        if ((await client.bal(message.author.id)) < convertedDonation) // Comprobamos si la cantidad a dar es mas de la que tiene el usuario en su balance
            return message.reply(":x:| Estas intentando dar mas de la cantidad disponible en tu balance");

        await client.rmv(message.author.id, convertedDonation); // Quitamos la cantidad al usuario
        await client.add(user.id, convertedDonation); // Se la damos al usuario a dar

        message.channel.send(`${message.author} le ha tradeado <:CIVCOIN:886443353170927658>${convertedDonation} a ${user}`);

    }

}