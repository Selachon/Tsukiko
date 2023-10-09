import ordr from "ordr.js"
import { config } from "dotenv"
config()
import newEmbed from '../utils/EmbedBuilder.js'
import myAvatarUrl from "./myAvatarUrl.js"
import { setTimeout as wait } from 'timers/promises'
const render = new ordr.Client(process.env.ORDR_KEY)

export default async function (url, user, skin = 'boop', interaction, iMsg) {
  let embed = newEmbed(interaction, {
    author: {
      name: interaction.client.user.username,
      iconURL: interaction.client.user.avatarURL({ size: 1024 })
    },
    color: 'Orange',
    thumbnail: user.avatar_url,
    footer: {
      text: `Render enviado por ${interaction.user.username}`,
      iconURL: myAvatarUrl(interaction)
    }
  })
  let replay = await render.newRender({
    replayURL: url,
    username: user.username,
    resolution: '1920x1080',
    globalVolume: 100,
    musicVolume: 70,
    hitsoundVolume: 100,
    skin: skin,
    inGameBGDim: 90,
    showDanserLogo: false,
    // devmode: 'success',
    showScoreboard: true,
  }).catch(err => {
    console.error(err)
    iMsg.edit({
      content: '',
      embeds: [embed.setTitle('Render error')
        .setDescription(`There was a ${err.type} with the rendering`)
        .setColor('DarkRed')
      ],
      ephemeral: true
    })
  })
  render.on('render_added', data => {
    if (data.renderID != replay.renderID) return
    iMsg.edit({
      content: '',
      embeds: [embed.setTitle('Render added!')
        .setDescription('Soon it will start rendering.')
      ],
      ephemeral: true
    })
    render.on('render_progress', data => {
      if (data.renderID != replay.renderID) return
      iMsg.edit({
        content: '',
        embeds: [embed.setTitle(data.progress)
          .setDescription(data.description)
        ]
      })
    })
    render.on('render_done', async data => {
      if (data.renderID != replay.renderID) return
      await wait(3000)
      let msg = await iMsg.edit({
        content: '',
        embeds: [embed.setTitle('Render finished!')
          .setColor('Green')
        ]
      })
      return await msg.reply({ content: `${interaction.user}\n${data.videoUrl}` })
    })
    render.on('render_failed', data => {
      if (data.renderID != replay.renderID) return
      iMsg.edit({
        content: '',
        embeds: [embed.setTitle('Render failed')
          .setDescription(data.errorMessage)
          .setColor('Red')
        ]
      })
    })
  })
  render.start()
}