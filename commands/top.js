import {
    SlashCommandBuilder as SCB,
    ButtonBuilder as BB,
    ButtonStyle as BS,
    ActionRowBuilder as ARB,
    ComponentType as CT
} from 'discord.js'
import { config } from 'dotenv'
import { setTimeout as wait } from 'timers/promises'
import getUser from '../utils/osuApi/getUser.js'
import getBeatmap from '../utils/osuApi/getBeatmap.js'
import getBestScores from '../utils/osuApi/getBestScores.js'
import findOne from '../utils/MongoDB/findOne.js'
import renderReplay from '../utils/renderReplay.js'
import getReplay from '../utils/osuApi/getReplay.js'
import fullDetailEmbed from '../utils/fullDetailEmbed.js'
import compactDetailEmbed from '../utils/compactDetailEmbed.js'
import pagesCompactEmbed from '../utils/pagesCompactEmbed.js'
import pagesEmbed from '../utils/pagesEmbed.js'
import setLatestMap from '../utils/MongoDB/setLatestMap.js'

config()

export default {
    data: new SCB()
        .setName('top')
        .setDescription('Mira tus top scores o de otro usuario')
        .addStringOption(op => op.setName('usuario').setDescription('Cualquier nombre de usuario de osu! o su ID'))
        .addStringOption(op => op.setName('modo').setDescription('El modo de juego del cual quieres ver las top plays')
            .addChoices({
                name: 'Standard',
                value: 'osu'
            }, {
                name: 'Mania',
                value: 'mania'
            }, {
                name: 'Catch The Beat',
                value: 'fruits'
            }, {
                name: 'Taiko',
                value: 'taiko'
            })),
    category: 'osu!',
    usage: `/top`,
    execute: async (Tsukiko, interaction) => {
        var osuser = interaction.options.getString('usuario')
        var osumode = interaction.options.getString('modo')
        if (!osuser) {
            var data = await findOne(interaction.user.id)
            if (!data)
                return interaction.reply({
                    content: 'No tienes seteado ningún usuario ni especificaste un usuario.\nPara usar un usuario predeterminado, usa **/set**',
                    ephemeral: true
                })
            osuser = data.osu.username
        }

        try {
            const osuUser = await getUser(osuser)
            const scores = !osumode ? await getBestScores(osuUser.id) : await getBestScores(osuUser.id, osumode)

            const complete = new BB()
                .setLabel('Completo')
                .setStyle(BS.Success)
                .setCustomId('complete')
            const compact = new BB()
                .setLabel('Compacto')
                .setStyle(BS.Primary)
                .setCustomId('compact')

            const buttons = new ARB()
                .addComponents(complete, compact)

            const next = new BB()
                .setLabel('➡️')
                .setStyle(BS.Primary)
                .setCustomId('next')
            const prev = new BB()
                .setLabel('⬅️')
                .setStyle(BS.Primary)
                .setCustomId('prev')
            const last = new BB()
                .setLabel('⏩')
                .setStyle(BS.Secondary)
                .setCustomId('last')
            const first = new BB()
                .setLabel('⏪')
                .setStyle(BS.Secondary)
                .setCustomId('first')

            const pageButtons = new ARB()
                .addComponents(first, prev, next, last)

            const next2 = new BB()
                .setLabel('➡️')
                .setStyle(BS.Primary)
                .setCustomId('next2')
            const prev2 = new BB()
                .setLabel('⬅️')
                .setStyle(BS.Primary)
                .setCustomId('prev2')
            const last2 = new BB()
                .setLabel('⏩')
                .setStyle(BS.Secondary)
                .setCustomId('last2')
            const first2 = new BB()
                .setLabel('⏪')
                .setStyle(BS.Secondary)
                .setCustomId('first2')

            const pageButtons2 = new ARB()
                .addComponents(first2, prev2, next2, last2)

            var page = 0

            let { beatmap, beatmapset, replay } = scores[page]
            const resBM = await getBeatmap(beatmap.id)
            beatmap.max_combo = resBM.data.max_combo
            let mode = beatmap.mode == 'osu' ? 'Standard' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'

            const bigEmbed = await fullDetailEmbed(Tsukiko, scores[page], mode, false, false)
            const compactEmbed = compactDetailEmbed(Tsukiko, scores, mode)

            const response = await interaction.reply({
                content: 'Cargando...'
            })
            await wait(3000)
            await interaction.editReply({
                content: '',
                embeds: [compactEmbed],
                components: [buttons]
            })

            const c = response.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, componentType: CT.Button, time: 120000 })

            c.on('collect', async i => {
                if (i.customId == 'complete') {
                    setLatestMap(beatmap.id)
                    page = 0
                    const pages = await i.update({
                        embeds: [bigEmbed],
                        components: [buttons, pageButtons],
                        files: [{
                            name: `${beatmapset.title}.mp3`,
                            attachment: `https:${beatmapset.preview_url}`
                        }]
                    })
                    if (replay && beatmap.mode === 'osu') await pages.interaction.message.react('🎬')
                    else await pages.interaction.message.reactions.removeAll()
                    const filter = (r, u) =>
                        ['🎬'].includes(r.emoji.name) && u.id === interaction.user.id && replay

                    const c3 = pages.interaction.message.createReactionCollector({ filter, time: 120000 })

                    c3.on('collect', async r => {
                        if (r.emoji.name == '🎬') {
                            await pages.interaction.message.reactions.removeAll()
                            let replay = await getReplay(Tsukiko, scores[page], osuUser)
                            let pagesMsg = await pages.interaction.message.reply({
                                content: 'Descargando replay...',
                                ephemeral: true
                            })
                            await wait(1500)
                            await renderReplay(replay.url, osuUser, undefined, pages.interaction, pagesMsg)
                        }
                    })
                    c3.on('end', async () => {
                        await pages.interaction.message.reactions.removeAll()
                    })
                    const c2 = pages.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, componentType: CT.Button, time: 120000 })

                    c2.on('collect', async i2 => {
                        if (i2.customId == 'prev') {
                            if (page != 0) page--
                            pagesEmbed(Tsukiko, scores, i2, buttons, pageButtons, page)
                        } else if (i2.customId == 'next') {
                            if (page != scores.length - 1) page++
                            pagesEmbed(Tsukiko, scores, i2, buttons, pageButtons, page)
                        } else if (i2.customId == 'first') {
                            page = 0
                            pagesEmbed(Tsukiko, scores, i2, buttons, pageButtons, page)
                        } else if (i2.customId == 'last') {
                            page = scores.length - 1
                            pagesEmbed(Tsukiko, scores, i2, buttons, pageButtons, page)
                        }
                    })
                    c2.on('end', async () => {
                        await interaction.editReply({ components: [] })
                    })
                } else if (i.customId == 'compact') {
                    page = 0
                    const pages = await i.update({
                        embeds: [compactEmbed],
                        components: [buttons, pageButtons2],
                        files: []
                    })
                    await pages.interaction.message.reactions.removeAll()
                    const c2 = pages.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, componentType: CT.Button, time: 120000 })

                    c2.on('collect', async i2 => {
                        if (i2.customId == 'prev2') {
                            if (page != 0) page--
                            pagesCompactEmbed(Tsukiko, scores, i2, buttons, pageButtons2, page)
                        } else if (i2.customId == 'next2') {
                            if (page != 4) page++
                            pagesCompactEmbed(Tsukiko, scores, i2, buttons, pageButtons2, page)
                        } else if (i2.customId == 'first2') {
                            page = 0
                            pagesCompactEmbed(Tsukiko, scores, i2, buttons, pageButtons2, page)
                        } else if (i2.customId == 'last2') {
                            page = 4
                            pagesCompactEmbed(Tsukiko, scores, i2, buttons, pageButtons2, page)
                        }
                    })
                    c2.on('end', async () => {
                        await interaction.editReply({ components: [] })
                    })
                }
            })
            c.on('end', async () => {
                await interaction.editReply({ components: [] })
            })
        } catch (e) {
            await interaction.reply({
                content: 'No se encontró el usuario',
                embeds: [],
                files: [],
                components: []
            })
            console.log(e)
        }
    },
}

function splitArray(arr, chunkSize) {
    let result = []

    for (let i = 0; i < arr.length; i += chunkSize) {
        let chunk = arr.slice(i, i + chunkSize)
        result.push(chunk)
    }

    return result
}