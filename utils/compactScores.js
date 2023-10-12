import getEmoji from "./getEmoji.js"

export default function (Tsukiko, pages = 1, data) {
  let score = ''
  var scores = []
  if (pages <= 0) pages = 1
  for (let j = 0; j < pages; j++) {
      for (let i = 10 * j; i < 10 * (j + 1); i++) {
          score += `**${i + 1}.** [${data[i].beatmapset.title} (${data[i].beatmap.version}) [${data[i].beatmap.difficulty_rating}\⭐]](${data[i].beatmap.url})
${getEmoji(Tsukiko, data[i].rank)} ${!data[i].mods[0] ? '' : `${data[i].mods.map(mod => getEmoji(Tsukiko, mod)).join('')} `}${(data[i].accuracy * 100).toFixed(2)}% | **${(data[i].pp).toFixed(2)}pp** <t:${new Date(data[i].created_at).getTime() / 1000}:R>\n`
      }
      scores.push(score)
      score = ''
  }
  return scores
}