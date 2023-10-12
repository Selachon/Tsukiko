import { EmbedBuilder } from "discord.js"
import getEmoji from '../utils/getEmoji.js'
import getRankImage from '../utils/getRankImage.js'

export default function (Tsukiko, play, mode, justOne, isRecent, excludeFails, page) {
  let { user, beatmap, beatmapset, created_at, max_combo, rank, mods, accuracy, pp } = play
  if (!justOne) {
    if (!page) return new EmbedBuilder()
      .setAuthor({
        name: `${isRecent ? '50 scores recientes' : 'Top 50 scores'} de ${mode} de ${user.username}`,
        iconURL: user.avatar_url,
        url: `https://osu.ppy.sh/users/${user.id}`
      })
      .setTitle(`**1.** ${beatmapset.title_unicode}${beatmapset.title_unicode == beatmapset.title ? '' : ` (${beatmapset.title})`}`)
      .setDescription(`Dificultad: [**${beatmap.version}** [${beatmap.difficulty_rating}\⭐]](${beatmap.url})${!mods[0] ? '' : `
Mods: ${mods.map(mod => getEmoji(Tsukiko, mod)).join('')}`}
Artista: **${beatmapset.artist_unicode}**${beatmapset.artist_unicode == beatmapset.artist ? '' : ` (${beatmapset.artist})`}
Mapper: **${beatmapset.creator}**`)
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
      .setTimestamp(new Date(created_at).getTime())

    return new EmbedBuilder()
      .setAuthor({
        name: `${isRecent ? '50 scores recientes' : 'Top 50 scores'} de ${mode} de ${user.username}`,
        iconURL: user.avatar_url,
        url: `https://osu.ppy.sh/users/${user.id}`
      })
      .setTitle(`**${page + 1}.** ${beatmapset.title_unicode}${beatmapset.title_unicode == beatmapset.title ? '' : ` (${beatmapset.title})`}`)
      .setDescription(`Dificultad: [**${beatmap.version}** [${beatmap.difficulty_rating}\⭐]](${beatmap.url})${!mods[0] ? '' : `
Mods: ${mods.map(mod => getEmoji(Tsukiko, mod)).join('')}`}
Artista: **${beatmapset.artist_unicode}**${beatmapset.artist_unicode == beatmapset.artist ? '' : ` (${beatmapset.artist})`}
Mapper: **${beatmapset.creator}**`)
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
      .setTimestamp(new Date(created_at).getTime())
  }
  return new EmbedBuilder()
    .setAuthor({
      name: `Último score de ${mode} de ${user.username}${excludeFails ? ' (Sin contar fails)' : ''}`,
      iconURL: user.avatar_url,
      url: `https://osu.ppy.sh/users/${user.id}`
    })
    .setTitle(`${beatmapset.title_unicode}${beatmapset.title_unicode == beatmapset.title ? '' : ` (${beatmapset.title})`}`)
    .setDescription(`Dificultad: [**${beatmap.version}** [${beatmap.difficulty_rating}\⭐]](${beatmap.url})${!mods[0] ? '' : `
Mods: ${mods.map(mod => getEmoji(Tsukiko, mod)).join('')}`}
Artista: **${beatmapset.artist_unicode}**${beatmapset.artist_unicode == beatmapset.artist ? '' : ` (${beatmapset.artist})`}
Mapper: **${beatmapset.creator}**`)
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
    .setTimestamp(new Date(created_at).getTime())
}