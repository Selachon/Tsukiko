import { SlashCommandBuilder as SCB } from 'discord.js'
import { config } from 'dotenv'
import { setTimeout as wait } from 'timers/promises'
import osuLogin from '../utils/osuApi/osuLogin.js'
import getMe from '../utils/osuApi/getMe.js'
import obj from '../utils/code.js'

// auth

config()

export default {
  data: new SCB()
    .setName('login')
    .setDescription('Authorize to get your osu! data automatically'),
  category: 'Idk',
  usage: `/login`,
  execute: async (Tsukiko, interaction) => {
    interaction.reply({
      content: `https://osu.ppy.sh/oauth/authorize?client_id=${process.env.OSU_CLIENT_ID
        }&redirect_uri=http://localhost:8080&response_type=code&scope=public+identify`,
      ephemeral: true
    })
    await wait(20000)
    try {
      const { code } = obj
      var token = await osuLogin(code)
    } catch (e) {
      console.log(e)
      return
    }
    try {
      var user = await getMe(token)
    } catch (e) {
      return interaction.editReply({
        content: e.message
      })
    }
    interaction.editReply({
      content: `https://osu.ppy.sh/users/${user.id}`
    })
  },
}
