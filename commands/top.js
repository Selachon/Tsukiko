import {
    EmbedBuilder as EB,
    SlashCommandBuilder as SCB,
    ButtonBuilder as BB,
    ButtonStyle as BS,
    ActionRowBuilder as ARB,
    ComponentType as CT
} from 'discord.js'
import { config } from 'dotenv'
import { setTimeout } from 'timers/promises'
import getEmoji from '../utils/getEmoji.js'
import getRankImage from '../utils/getRankImage.js'
import getUser from '../utils/osuApi/getUser.js'
import getBeatmap from '../utils/osuApi/getBeatmap.js'
import getBestScores from '../utils/osuApi/getBestScores.js'
import download from '../utils/download.cjs'

const wait = setTimeout
config()

export default {
    data: new SCB()
        .setName('top')
        .setDescription('Mira tus top scores de cualquier modo')
        .addStringOption(op => op.setName('usuario').setDescription('Cualquier nombre de usuario de osu! o su ID')
            .setRequired(true)),
    category: 'osu!',
    usage: `/top`,
    execute: async (Tsukiko, interaction) => {
        let osuser = interaction.options.getString('usuario')
        try {
            const osuUser = await getUser(osuser)
            const scores = await getBestScores(osuUser.id)
            console.log(`https://osu.ppy.sh/scores/${scores[0].mode}/${scores[0].best_id}/download`)

            // Url of the image
            const file = `https://osu.ppy.sh/scores/${scores[0].mode}/${scores[0].best_id}/download`

            download(file)

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

            let page = 0

            let { beatmap, beatmapset } = scores[page]
            const resBM = await getBeatmap(beatmap.id)
            beatmap.max_combo = resBM.data.max_combo
            let mode = beatmap.mode == 'osu' ? 'Standard' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'

            const bigEmbed = fullDetailEmbed(Tsukiko, scores[0], mode)
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

            const c = response.createMessageComponentCollector({ componentType: CT.Button, time: 120000 })

            c.on('collect', async i => {
                if (i.customId == 'complete') {
                    page = 0
                    const pages = await i.update({
                        embeds: [bigEmbed],
                        components: [buttons, pageButtons],
                        files: [{
                            name: `${beatmapset.title}.mp3`,
                            attachment: `https:${beatmapset.preview_url}`
                        }]
                    })
                    const c2 = pages.createMessageComponentCollector({ componentType: CT.Button, time: 120000 })

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
                    const c2 = pages.createMessageComponentCollector({ componentType: CT.Button, time: 120000 })

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

async function pagesEmbed(Tsukiko, scores, interaction, buttons, pageButtons, page) {
    let play = scores[page]
    let { beatmap, beatmapset } = play
    const resBM = await getBeatmap(beatmap.id)
    beatmap.max_combo = resBM.data.max_combo
    let mode = beatmap.mode == 'osu' ? 'Standard' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'
    await interaction.update({
        embeds: [fullDetailEmbed(Tsukiko, play, mode, page)],
        components: [buttons, pageButtons],
        files: [{
            name: `${beatmapset.title}.mp3`,
            attachment: `https:${beatmapset.preview_url}`
        }]
    })
}

async function pagesCompactEmbed(Tsukiko, scores, interaction, buttons, pageButtons, page) {
    let { beatmap } = scores[page]
    let mode = beatmap.mode == 'osu' ? 'Standard' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'
    await interaction.update({
        embeds: [compactDetailEmbed(Tsukiko, scores, mode, page)],
        components: [buttons, pageButtons],
        files: []
    })
}

function splitArray(arr, chunkSize) {
    let result = []

    for (let i = 0; i < arr.length; i += chunkSize) {
        let chunk = arr.slice(i, i + chunkSize)
        result.push(chunk)
    }

    return result
}

function compactScores(Tsukiko, pages = 1, data) {
    let score = ''
    var scores = []
    if (pages <= 0) pages = 1
    for (let j = 0; j < pages; j++) {
        for (let i = 10 * j; i < 10 * (j + 1); i++) {
            score += `**${i + 1}.** [${data[i].beatmapset.title} (${data[i].beatmap.version}) [${data[i].beatmap.difficulty_rating}\⭐]](${data[i].beatmap.url})
${getEmoji(Tsukiko, data[i].rank)} ${!data[i].mods[0] ? '' : `${data[i].mods.map(mod => getEmoji(Tsukiko, mod)).join('')} `}${(data[i].accuracy * 100).toFixed(2)}% | **${(data[i].pp).toFixed(2)}pp** <t:${new Date(data[i].created_at).getTime() / 1000}:R>\n`
        }
        scores.push(score)
        score = ''
    }
    return scores
}

function fullDetailEmbed(Tsukiko, play, mode, page) {
    let { user, beatmap, beatmapset, created_at, max_combo, rank, mods, accuracy, pp } = play
    if (!page) return new EB()
        .setAuthor({
            name: `Top 50 scores de ${mode} de ${user.username}`,
            iconURL: user.avatar_url,
            url: `https://osu.ppy.sh/users/${user.id}`
        })
        .setTitle(`**1.** ${beatmapset.title_unicode}${beatmapset.title_unicode == beatmapset.title ? '' : ` (${beatmapset.title})`}`)
        .setDescription(`Dificultad: [**${beatmap.version}** [${beatmap.difficulty_rating}\⭐]](${beatmap.url})${!mods[0] ? '' : `
Mods: ${mods.map(mod => getEmoji(Tsukiko, mod)).join('')}`}
Artista: **${beatmapset.artist_unicode}**${beatmapset.artist_unicode == beatmapset.artist ? '' : ` (${beatmapset.artist})`}
Mapper: **${beatmapset.creator}**`)
        .setFields({
            name: 'Combo',
            value: `${max_combo}/${beatmap.max_combo}${max_combo == beatmap.max_combo ? ' FC' : ''}`,
            inline: true
        }, {
            name: 'Acc',
            value: `${(accuracy * 100).toFixed(2)}%`,
            inline: true
        }, {
            name: 'PP',
            value: `${(pp).toFixed(2)}pp`,
            inline: true
        })
        .setImage(beatmapset.covers['card@2x'])
        .setThumbnail(getRankImage(rank))
        .setTimestamp(new Date(created_at).getTime())

    return new EB()
        .setAuthor({
            name: `Top 50 scores de ${mode} de ${user.username}`,
            iconURL: user.avatar_url,
            url: `https://osu.ppy.sh/users/${user.id}`
        })
        .setTitle(`**${page + 1}.** ${beatmapset.title_unicode}${beatmapset.title_unicode == beatmapset.title ? '' : ` (${beatmapset.title})`}`)
        .setDescription(`Dificultad: [**${beatmap.version}** [${beatmap.difficulty_rating}\⭐]](${beatmap.url})${!mods[0] ? '' : `
Mods: ${mods.map(mod => getEmoji(Tsukiko, mod)).join('')}`}
Artista: **${beatmapset.artist_unicode}**${beatmapset.artist_unicode == beatmapset.artist ? '' : ` (${beatmapset.artist})`}
Mapper: **${beatmapset.creator}**`)
        .setFields({
            name: 'Combo',
            value: `${max_combo}/${beatmap.max_combo}${max_combo == beatmap.max_combo ? ' FC' : ''}`,
            inline: true
        }, {
            name: 'Acc',
            value: `${(accuracy * 100).toFixed(2)}%`,
            inline: true
        }, {
            name: 'PP',
            value: `${(pp).toFixed(2)}pp`,
            inline: true
        })
        .setImage(beatmapset.covers['card@2x'])
        .setThumbnail(getRankImage(rank))
        .setTimestamp(new Date(created_at).getTime())
}

function compactDetailEmbed(Tsukiko, data, mode, page) {
    let { user } = data[0]
    var scores = ''
    for (let i = 0; i < 10; i++) {
        scores += `**${i + 1}.** [${data[i].beatmapset.title} (${data[i].beatmap.version}) [${data[i].beatmap.difficulty_rating}\⭐]](${data[i].beatmap.url})
**${data[i].rank}** (+${data[i].mods.join('')}) ${(data[i].accuracy * 100).toFixed(2)}% | **${(data[i].pp).toFixed(2)}pp** <t:${new Date(data[i].created_at).getTime() / 1000}:R>\n`
    }
    if (!page) return new EB()
        .setAuthor({
            name: user.username,
            iconURL: user.avatar_url,
            url: `https://osu.ppy.sh/users/${user.id}`
        })
        .setTitle(`Top 10 scores de ${mode}`)
        .setDescription(compactScores(Tsukiko, 5, data)[0])
        .setFooter({
            text: 'Si no te aparecen los controles de páginas, da clic en el botón de Compacto - 1'
        })

    return new EB()
        .setAuthor({
            name: user.username,
            iconURL: user.avatar_url,
            url: `https://osu.ppy.sh/users/${user.id}`
        })
        .setTitle(`Top 10 scores de ${mode}`)
        .setDescription(compactScores(Tsukiko, 5, data)[page])
        .setFooter({
            text: 'Si no te aparecen los controles de páginas, da clic en el botón de Compacto - ' + `${page + 1}`
        })
}