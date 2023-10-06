import { EmbedBuilder } from "discord.js";
import myAvatarUrl from "./myAvatarUrl.js";

export default function (interaction, {
  author, title, description,
  thumbnail, image, fields,
  color, footer, timestamp
}) {
  const embed = new EmbedBuilder()

  if (typeof author == "boolean") {
    switch (author) {
      case true:
        embed.setAuthor({
          name: interaction.member.nickname,
          iconURL: myAvatarUrl(interaction, 2)
        })
      case false:
        embed.setAuthor({
          name: interaction.user.username,
          iconURL: myAvatarUrl(interaction)
        })
    }
  } else if (author == 'bot') {
    embed.setAuthor({
      name: interaction.client.user.username,
      iconURL: myAvatarUrl(interaction, 3)
    })
  } else {
    embed.setAuthor(author)
  }
  if (title) embed.setTitle(title)
  if (description) embed.setDescription(description)
  if (thumbnail) embed.setThumbnail(thumbnail)
  if (image) embed.setImage(image)
  if (fields) embed.setFields(fields)
  if (color) embed.setColor(color)
  if (footer) embed.setFooter(footer)
  if (timestamp) embed.setTimestamp()

  return embed
}