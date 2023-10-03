import { Client, Collection, GatewayIntentBits as GIB } from 'discord.js'
import { config } from 'dotenv'
import axios from 'axios'

config()

const auth = await axios({
    method: 'POST',
    url: `https://osu.ppy.sh/oauth/token`,
    headers: {
        Accept: 'application/json',
        "Content-Type": 'application/x-www-form-urlencoded'
    },
    data: {
        client_id: process.env.OSU_CLIENT_ID,
        client_secret: process.env.OSU_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'public'
    }
})
axios.defaults.baseURL = 'https://osu.ppy.sh/api/v2'
axios.defaults.headers.common.Authorization = `Bearer ${auth.data.access_token}`

const {
    DirectMessageReactions,
    DirectMessageTyping,
    DirectMessages,
    GuildIntegrations,
    GuildMembers,
    GuildMessageReactions,
    GuildMessageTyping,
    GuildMessages,
    GuildWebhooks,
    Guilds,
    MessageContent
} = GIB

const Tsukiko = new Client({
    intents: [
        DirectMessageReactions,
        DirectMessageTyping,
        DirectMessages,
        GuildIntegrations,
        GuildMembers,
        GuildMessageReactions,
        GuildMessageTyping,
        GuildMessages,
        GuildWebhooks,
        Guilds,
        MessageContent
    ]
})

Tsukiko.commands = new Collection()
Tsukiko.commands.slash = new Collection()
Tsukiko.commands.regular = new Collection()

import e from './handlers/eventHandler.js'; e(Tsukiko)
import c from './handlers/slashCommandHandler.cjs'; c(Tsukiko)


Tsukiko.login(process.env.TOKEN)
