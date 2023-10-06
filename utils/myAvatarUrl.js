export default function (interaction, type = 1) {
  if (type == 3) {
    return interaction.client.user.avatarURL({
      size: 1024
    })
  } else if (type == 2) {
    return interaction.member.avatarURL({
      size: 1024
    })
  } else {
    return interaction.user.avatarURL({
      size: 1024
    })
  }
}