import compactDetailEmbed from "./compactDetailEmbed.js"

export default async function (Tsukiko, scores, interaction, buttons, pageButtons, page) {
  let { beatmap } = scores[page]
  let mode = beatmap.mode == 'osu' ? 'Standard' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'
  await interaction.update({
      embeds: [compactDetailEmbed(Tsukiko, scores, mode, page)],
      components: [buttons, pageButtons],
      files: []
  })
}