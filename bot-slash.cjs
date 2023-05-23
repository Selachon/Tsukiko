const { REST, Routes } = require('discord.js')
const { readdirSync } = require('node:fs')
require('dotenv').config()

const commands = []

const run = async () => {
	const config = await import('./config.js')
	const { clientId } = config.default

	const commandFiles = readdirSync('./commands/').filter(file => file.endsWith('.js'))

	for (const file of commandFiles) {
		let command = await import(`./commands/${file}`)
		command = command.default
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if (command.data && command.execute) {
			commands.push(command.data.toJSON())
		} else {
			console.log(`[WARNING] A command at ./commands/ is missing a required "data" or "execute" property.`)
		}
	}

	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(process.env.TOKEN)

	// and deploy your commands!
	const run2 = async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`)

			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			)

			console.log(`Successfully reloaded ${data.length} application (/) commands.`)
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error)
		}
	}
	run2()
}

run()