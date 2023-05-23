import Ready from '../events/ready.js'
import MessageCreate from '../events/messageCreate.js'
import InteractionCreate from '../events/interactionCreate.js'

export default (Tsukiko) => {
    Tsukiko.on('ready', async () => Ready(Tsukiko))
    Tsukiko.on('messageCreate', async msg => MessageCreate(Tsukiko, msg))
    Tsukiko.on('interactionCreate', async interaction => InteractionCreate(Tsukiko, interaction))
}