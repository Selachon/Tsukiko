import { Client, Collection, GatewayIntentBits as GIB } from 'discord.js'
import { config } from 'dotenv'
import axios from 'axios'
import clientLogin from './utils/osuApi/clientLogin.js'
// import main from './main.js'
import db from './utils/MongoDB/Connect.js'

config();

(async function () {
    axios.defaults.headers.common.Authorization = `Bearer ${await clientLogin()}`
})()

axios.defaults.baseURL = 'https://osu.ppy.sh/api/v2'

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
