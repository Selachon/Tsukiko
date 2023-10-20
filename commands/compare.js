import { SlashCommandBuilder as SCB } from 'discord.js'
import getUserBeatmapScores from '../utils/osuApi/getUserBeatmapScores.js'
import getLatestBeatmap from '../utils/MongoDB/getLatestBeatmap.js'
import findOne from '../utils/MongoDB/findOne.js'
import getUser from '../utils/osuApi/getUser.js'
import getBeatmap from '../utils/osuApi/getBeatmap.js'
import fullCompareEmbed from '../utils/fullCompareEmbed.js'

export default {
  data: new SCB()
    .setName('compare')
    .setDescription('Compara tu score con el score más reciente en el canal')
    .addStringOption(op => op.setName('usuario').setDescription('Cualquier nombre de usuario de osu! o su ID')),
  category: 'osu!',
  usage: `/compare [usuario]`,
  execute: async (Tsukiko, interaction) => {
    var osuser = interaction.options.getString('usuario')
    if (!osuser) {
      var data = await findOne(interaction.user.id)
      if (!data)
        return interaction.reply({
          content: 'No tienes seteado ningún usuario ni especificaste un usuario.\nPara usar un usuario predeterminado, usa **/set**',
          ephemeral: true
        })
      osuser = data.osu.username
    }
    try {
      const osuUser = await getUser(osuser)
      const latestMap = await getLatestBeatmap()
      var scores = await getUserBeatmapScores(latestMap.id, osuUser.id)
      scores = scores.scores

      let { mode, max_combo } = scores[0]
      const resBM = await getBeatmap(latestMap.id)
      max_combo = resBM.data.max_combo
      let Mode = mode == 'osu' ? 'Standard' : mode == 'mania' ? 'Mania' : mode == 'fruits' ? 'CTB' : 'Taiko'

      return interaction.reply({
        embeds: [await fullCompareEmbed(Tsukiko, scores[0], osuUser, resBM.data, Mode)]
      })
    } catch (e) {
      console.error(e)
    }
  },
}