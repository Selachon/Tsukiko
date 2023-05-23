const { readdirSync } = require('fs')

module.exports = async (Tsukiko) => {
    const commandFiles = readdirSync('./commands/').filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
        let command = await import(`../commands/${file}`)
        command = command.default
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if (command.data && command.execute) {
            Tsukiko.commands.slash.set(command.data.name, command)
        } else {
            console.log(`[WARNING] A command at ./commands/ is missing a required "data" or "execute" property.`)
        }
    }
}