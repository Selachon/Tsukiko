export default async (Tsukiko, interaction) => {
    if (!interaction.isChatInputCommand()) return
    const cmd = interaction.client.commands.slash.get(interaction.commandName)

	if (!cmd) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		await cmd.execute(Tsukiko, interaction)
	} catch (e) {
		console.error(e)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Hubo un error intentando ejecutar el comando.', ephemeral: true })
		} else {
			await interaction.reply({ content: 'Hubo un error intentando ejecutar el comando.', ephemeral: true })
		}
	}
}