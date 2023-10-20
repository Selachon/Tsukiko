import { SlashCommandBuilder as SCB } from 'discord.js'
import getRecentScores from '../utils/osuApi/getRecentScores.js'
import getUser from '../utils/osuApi/getUser.js'
import findOne from '../utils/MongoDB/findOne.js'
import fullDetailEmbed from '../utils/fullDetailEmbed.js'
import getBeatmap from '../utils/osuApi/getBeatmap.js'
import setLatestMap from '../utils/MongoDB/setLatestMap.js'

export default {
  data: new SCB()
    .setName('recent')
    .setDescription('Mira tus scores recientes o de otro usuario')
    .addSubcommand(s => s.setName('score').setDescription('Score más reciente (Igual que /rs)')
      .addStringOption(op => op.setName('usuario').setDescription('Cualquier nombre de usuario de osu! o su ID'))
      .addStringOption(op => op.setName('modo').setDescription('El modo de juego del cual quieres ver las plays recientes')
        .addChoices({
          name: 'Standard',
          value: 'osu'
        }, {
          name: 'Mania',
          value: 'mania'
        }, {
          name: 'Catch The Beat',
          value: 'fruits'
        }, {
          name: 'Taiko',
          value: 'taiko'
        })).addBooleanOption(op => op.setName('nofails').setDescription('Excluye los fail scores recientes'))),
  category: 'osu!',
  usage: `/recent [usuario] [modo] [nofails]`,
  execute: async (Tsukiko, interaction) => {
    const subcommand = interaction.options.getSubcommand(true)
    if (subcommand == 'score') {
      var osuser = interaction.options.getString('usuario')
      var osumode = interaction.options.getString('modo')
      let excludeFails = interaction.options.getBoolean('nofails')
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
        const scores = !osumode ? await getRecentScores(osuUser.id, undefined, excludeFails) : await getRecentScores(osuUser.id, osumode, excludeFails)

        let recentScore = scores[0]
        if (!recentScore) {
          return interaction.reply({
            content: `[${osuUser.username}](https://osu.ppy.sh/users/${osuUser.id}) no tiene plays en las últimas 24 horas`,
            ephemeral: true
          })
        }
        setLatestMap(recentScore.beatmap.id)
        const resBM = await getBeatmap(recentScore.beatmap.id)
        recentScore.beatmap.max_combo = resBM.data.max_combo
        let mode = recentScore.beatmap.mode == 'osu' ? 'Standard' : recentScore.beatmap.mode == 'mania' ? 'Mania' : recentScore.beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'

        return interaction.reply({
          embeds: [await fullDetailEmbed(Tsukiko, recentScore, mode, true, true, excludeFails)]
        })
      } catch (e) {
        await interaction.reply({
          content: 'No se encontró el usuario',
          embeds: [],
          files: [],
          components: [],
          ephemeral: true
        })
        console.log(e)
      }
    }
  },
}