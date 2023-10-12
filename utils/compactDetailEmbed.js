import { EmbedBuilder } from "discord.js"
import compactScores from "./compactScores.js"

export default function (Tsukiko, data, mode, page) {
  let { user } = data[0]
  var scores = ''
  for (let i = 0; i < 10; i++) {
      scores += `**${i + 1}.** [${data[i].beatmapset.title} (${data[i].beatmap.version}) [${data[i].beatmap.difficulty_rating}\⭐]](${data[i].beatmap.url})
**${data[i].rank}** (+${data[i].mods.join('')}) ${(data[i].accuracy * 100).toFixed(2)}% | **${(data[i].pp).toFixed(2)}pp** <t:${new Date(data[i].created_at).getTime() / 1000}:R>\n`
  }
  if (!page) return new EmbedBuilder()
      .setAuthor({
          name: `Perfil de ${user.username}`,
          url: `https://osu.ppy.sh/users/${user.id}`
      })
      .setTitle(`Top 50 scores de ${mode}`)
      .setDescription(compactScores(Tsukiko, 5, data)[0])
      .setThumbnail(user.avatar_url)
      .setFooter({
          text: 'Si no te aparecen los controles de páginas, da clic en el botón de Compacto - 1'
      })

  return new EmbedBuilder()
      .setAuthor({
          name: `Perfil de ${user.username}`,
          url: `https://osu.ppy.sh/users/${user.id}`
      })
      .setTitle(`Top 50 scores de ${mode}`)
      .setDescription(compactScores(Tsukiko, 5, data)[page])
      .setThumbnail(user.avatar_url)
      .setFooter({
          text: 'Si no te aparecen los controles de páginas, da clic en el botón de Compacto - ' + `${page + 1}`
      })
}