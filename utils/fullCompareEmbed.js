import { EmbedBuilder } from "discord.js"
import getEmoji from './getEmoji.js'
import getRankImage from './getRankImage.js'
import getUser from "./osuApi/getUser.js"

export default async function (Tsukiko, play, user, beatmap, mode) {
  let { created_at, max_combo, rank, mods, accuracy, pp } = play
  let { beatmapset } = beatmap
  var mapper = await getUser(beatmapset.creator)
  return new EmbedBuilder()
    .setAuthor({
      name: `Mejor score de ${mode} de ${user.username} en`,
      iconURL: user.avatar_url,
      url: `https://osu.ppy.sh/users/${user.id}`
    })
    .setTitle(`${beatmapset.title_unicode}${beatmapset.title_unicode == beatmapset.title ? '' : ` (${beatmapset.title})`}`)
    .setDescription(`Dificultad: [**${beatmap.version}** [${beatmap.difficulty_rating}\⭐]](${beatmap.url})${!mods[0] ? '' : `
Mods: ${mods.map(mod => getEmoji(Tsukiko, mod)).join('')}`}
Artista: **${beatmapset.artist_unicode}**${beatmapset.artist_unicode == beatmapset.artist ? '' : ` (${beatmapset.artist})`}
<t:${new Date(created_at).getTime() / 1000}:R>`)
    .setFields({
      name: 'Combo',
      value: `${max_combo}/${beatmap.max_combo}${max_combo == beatmap.max_combo ? ' FC' : ''}`,
      inline: true
    }, {
      name: 'Acc',
      value: `${(accuracy * 100).toFixed(2)}%`,
      inline: true
    }, {
      name: 'PP',
      value: `${(!pp ? 0 : pp).toFixed(2)}pp`,
      inline: true
    })
    .setImage(beatmapset.covers['card@2x'])
    .setThumbnail(getRankImage(rank))
    .setFooter({
      text: `Mapeado por ${mapper.username}`,
      iconURL: mapper.avatar_url
    })
}