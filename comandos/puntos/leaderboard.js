const Discord = require('discord.js');
const client = new Discord.Client();
const {
    Client,
    MessageEmbed,
    Collection
} = require('discord.js');

module.exports = {
    name: "leaderboard-top",
    alias: [],
    async execute(client, message, args) {

        const user = message.member; // User

        let rol = message.guild.roles.cache.find(r => r.name === 'TESORERO SERVER')
        if (!user.roles.cache.has(rol.id)) return message.channel.send(":x:| No puedes utilizar este comando") // Si el usuario no tiene el rol TESORERO que no pueda usar el comando

        // Map leaderboard
        const collection = new Collection();

        await Promise.all(
            message.guild.members.cache.map(async (member) => {
                const id = member.id;
                const bal = await client.bal(id);
                return bal !== 0 ? collection.set(id, {
                        id,
                        bal,
                    }) :
                    null
            })
        );

        const data = collection.sort((a, b) => b.bal - a.bal).first(10); // Creamos una leaderboard de un top 10

        message.channel.send(
            new MessageEmbed()
            .setTitle(`Leaderboard de ${message.guild.name}`)
            .setDescription(
                data.map((v, i) => {
                    return `${i+1}) ${client.users.cache.get(v.id).tag} • <:CIVCOIN:886443353170927658>**${v.bal.toLocaleString('en-US')}**`
                })
            )
            .setFooter("Solo se mostraran los primeros 10")
            .setColor("GREEN")
        )

    }

}