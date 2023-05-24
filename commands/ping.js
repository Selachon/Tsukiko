import { SlashCommandBuilder as SCB } from 'discord.js'

export default {
    data: new SCB()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    category: 'Miscellaneous',
    usage: `/ping`,
    execute: async (Tsukiko, interaction) => {
        await interaction.reply('Pong!')
    },
}