import fullDetailEmbed from "./fullDetailEmbed.js"
import getBeatmap from "./osuApi/getBeatmap.js"

export default async function (Tsukiko, scores, interaction, buttons, pageButtons, page) {
  let play = scores[page]
  let { beatmap, beatmapset } = play
  const resBM = await getBeatmap(beatmap.id)
  beatmap.max_combo = resBM.data.max_combo
  let mode = beatmap.mode == 'osu' ? 'Standard' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'
  let score = await interaction.update({
      embeds: [fullDetailEmbed(Tsukiko, play, mode, false, false, false, page)],
      components: [buttons, pageButtons],
      files: [{
          name: `${beatmapset.title}.mp3`,
          attachment: `https:${beatmapset.preview_url}`
      }]
  })
  if (play.replay && beatmap.mode === 'osu') await score.interaction.message.react('🎬')
  else await score.interaction.message.reactions.removeAll()
}