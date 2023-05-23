import { Client, Collection, GatewayIntentBits as GIB } from 'discord.js'
import { config } from 'dotenv'

config()

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
