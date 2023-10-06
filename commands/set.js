import { SlashCommandBuilder as SCB } from 'discord.js'
import db from '../utils/MongoDB/Connect.js'
import insertOne from '../utils/MongoDB/insertOne.js'
import findOne from '../utils/MongoDB/findOne.js'
import getUser from '../utils/osuApi/getUser.js'
import newEmbed from '../utils/EmbedBuilder.js'
import updateOne from '../utils/MongoDB/updateOne.js'
const Users = db.collection('Users')

export default {
  data: new SCB()
    .setName('set')
    .setDescription('Especifica tu nombre de usuario para que sea el predeterminado al usar los comandos')
    .addStringOption(op =>
      op.setName('usuario')
        .setDescription('Tu nombre de usuario de osu! o el ID')
        .setRequired(true)
    ),
  category: 'osu!',
  usage: `/set `,
  execute: async (Tsukiko, interaction) => {
    const i = interaction
    const { user, options } = i
    var data = await findOne(user.id)
    if (!data) {
      insertOne(user.id, options.getString('usuario'))
      data = await findOne(user.id)
      let osuUser = await getUser(data.osu.username)
      if (!osuUser) {
        return i.reply({
          embeds: [newEmbed(i, {
            author: false,
            title: 'Usuario no guardado',
            description: `No se encontró el usuario ${isNaN(data.osu.username) ? `**${data.osu.username}**` : `con ID **${data.osu.username}**`} en osu!`,
            color: 'Red'
          })],
          ephemeral: true
        })
      }
      return i.reply({
        embeds: [newEmbed(i, {
          author: false,
          title: 'Usuario guardado',
          description: `Se guardo **[${osuUser.username}](https://osu.ppy.sh/users/${osuUser.id})** como tu usuario predeterminado de osu!`,
          color: 'Green'
        })],
        ephemeral: true
      })
    }
    data = await updateOne(user.id, options.getString('usuario'))
    let osuUser = await getUser(data.osu.username)
    
    if (!osuUser) {
      return i.reply({
        embeds: [newEmbed(i, {
          author: false,
          title: 'Usuario no actualizado',
          description: `No se encontró el usuario ${isNaN(data.osu.username) ? `**${data.osu.username}**` : `con ID **${data.osu.username}**`} en osu!`,
          color: 'Red'
        })],
        ephemeral: true
      })
    }
    return i.reply({
      embeds: [newEmbed(i, {
        author: false,
        title: 'Usuario actualizado',
        description: `Se actualizo a **[${osuUser.username}](https://osu.ppy.sh/users/${osuUser.id})** como tu usuario predeterminado de osu!`,
        color: 'Green'
      })],
      ephemeral: true
    })
  },
}