export default function (Tsukiko, emojiName) {
  let guild = Tsukiko.guilds.cache.get('1029068205584556134')
  let emojis = guild.emojis.cache
  if (typeof emojiName != 'string') throw new TypeError('emojiName must be a string.')
  if (emojiName == 'XH' || emojiName == 'X' ||
  emojiName == 'SH' || emojiName == 'S' ||
  emojiName == 'A' || emojiName == 'B' ||
  emojiName == 'C' || emojiName == 'D') {
    let emoji1 = emojis.find(e => e.name == `${emojiName}1`)
    let emoji2 = emojis.find(e => e.name == `${emojiName}2`)
    let emojiText = `<${emoji1.animated ? 'a' : ''}:${emoji1.name}:${emoji1.id}><${emoji2.animated ? 'a' : ''}:${emoji2.name}:${emoji2.id}>`
    return emojiText
  }
  let emoji = emojis.find(e => e.name == emojiName)
  if (!emoji) throw new Error(`'${emojiName}' is not a valid emoji.`)
  let emojiText = `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`
  return emojiText
}