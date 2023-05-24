import {
    EmbedBuilder as EB,
    SlashCommandBuilder as SCB,
    ButtonBuilder as BB,
    ButtonStyle as BS,
    ActionRowBuilder as ARB,
    ComponentType as CT
} from 'discord.js'
import axios from 'axios'
import { config } from 'dotenv'
import { setTimeout } from 'timers/promises'
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
            const resUser = await axios({
                method: 'GET',
                url: `https://osu.ppy.sh/api/v2/users/${osuser}`,
                headers: {
                    Authorization: `Bearer ${auth.data.access_token}`
                },
                params: {
                    limit: 50
                }
            })

            const osuUser = resUser.data

            const res = await axios({
                method: 'GET',
                url: `https://osu.ppy.sh/api/v2/users/${osuUser.id}/scores/best`,
                headers: {
                    Authorization: `Bearer ${auth.data.access_token}`
                },
                params: {
                    limit: 50
                }
            })

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
                .setCustomId('next')
            const prev2 = new BB()
                .setLabel('⬅️')
                .setStyle(BS.Primary)
                .setCustomId('prev')
            const last2 = new BB()
                .setLabel('⏩')
                .setStyle(BS.Secondary)
                .setCustomId('last')
            const first2 = new BB()
                .setLabel('⏪')
                .setStyle(BS.Secondary)
                .setCustomId('first')

            const pageButtons2 = new ARB()
                .addComponents(first2, prev2, next2, last2)

            let page = 0

            let p1 = res.data[page]
            let { user, beatmap, beatmapset, max_combo, accuracy, pp, created_at, rank, mods } = p1
            const resBM = await axios({
                method: 'GET',
                url: `https://osu.ppy.sh/api/v2/beatmaps/${beatmap.id}`,
                headers: {
                    Authorization: `Bearer ${auth.data.access_token}`
                },
                params: {
                    limit: 50
                }
            })
            beatmap.max_combo = resBM.data.max_combo
            let mode = beatmap.mode == 'osu' ? 'Standard' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'
            const bigEmbed = new EB()
                .setAuthor({
                    name: `Top 50 scores de ${mode} de ${user.username}`,
                    iconURL: user.avatar_url,
                    url: `https://osu.ppy.sh/users/${user.id}`
                })
                .setTitle(`**1.** ${beatmapset.title_unicode}${beatmapset.title_unicode == beatmapset.title ? '' : ` (${beatmapset.title})`}`)
                .setDescription(`Dificultad: [**${beatmap.version}** [${beatmap.difficulty_rating}\⭐]](${beatmap.url}) +${mods.join('')}
Artista: **${beatmapset.artist_unicode}**${beatmapset.artist_unicode == beatmapset.artist ? '' : ` (${beatmapset.artist})`})
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
                .setThumbnail(`https://s.ppy.sh/images/${rank}.png`)
                .setTimestamp(new Date(created_at).getTime())

            var scores = ''
            for (let i = 0; i < 10; i++) {
                scores += `**${i + 1}.** [${res.data[i].beatmapset.title} (${res.data[i].beatmap.version}) [${res.data[i].beatmap.difficulty_rating}\⭐]](${res.data[i].beatmap.url})
**${res.data[i].rank}** (+${res.data[i].mods.join('')}) ${(res.data[i].accuracy * 100).toFixed(2)}% | **${(res.data[i].pp).toFixed(2)}pp** <t:${new Date(res.data[i].created_at).getTime() / 1000}:R>\n`
            }

            const compactEmbed = new EB()
                .setAuthor({
                    name: user.username,
                    iconURL: user.avatar_url,
                    url: `https://osu.ppy.sh/users/${user.id}`
                })
                .setTitle(`Top 10 scores de ${mode}`)
                .setDescription(compactScores(5, res)[0])
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
                            if (page == 0) { } else page--
                            pagesEmbed(auth, res, i2, buttons, pageButtons, page)
                        } else if (i2.customId == 'next') {
                            if (page == res.data.length - 1) { } else page++
                            pagesEmbed(auth, res, i2, buttons, pageButtons, page)
                        } else if (i2.customId == 'first') {
                            page = 0
                            pagesEmbed(auth, res, i2, buttons, pageButtons, page)
                        } else if (i2.customId == 'last') {
                            page = res.data.length - 1
                            pagesEmbed(auth, res, i2, buttons, pageButtons, page)
                        }
                    })
                    c2.on('end', async () => {
                        await interaction.editReply({ components: [], files: [] })
                    })
                } else if (i.customId == 'compact') {
                    await i.update({
                        embeds: [compactEmbed],
                        components: [buttons],
                        files: []
                    })
                }
            })
            c.on('end', async () => {
                await interaction.editReply({ components: [], files: [] })
            })
        } catch (e) {
            await interaction.reply({
                content: 'No se encontró el usuario',
                embeds: [],
                files: [],
                components: []
            })
        }
    },
}

async function pagesEmbed(auth, res, i2, buttons, pageButtons, page) {
    let p1 = res.data[page]
    let { user, beatmap, beatmapset, created_at, max_combo, rank, mods, accuracy, pp } = p1
    const resBM = await axios({
        method: 'GET',
        url: `https://osu.ppy.sh/api/v2/beatmaps/${beatmap.id}`,
        headers: {
            Authorization: `Bearer ${auth.data.access_token}`
        },
        params: {
            limit: 50
        }
    })
    beatmap.max_combo = resBM.data.max_combo
    let mode = beatmap.mode == 'osu' ? 'Standard' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'
    await i2.update({
        embeds: [new EB()
            .setAuthor({
                name: `Top 50 scores de ${mode} de ${user.username}`,
                iconURL: user.avatar_url,
                url: `https://osu.ppy.sh/users/${user.id}`
            })
            .setTitle(`**${page + 1}.** ${beatmapset.title_unicode}${beatmapset.title_unicode == beatmapset.title ? '' : ` (${beatmapset.title})`}`)
            .setDescription(`Dificultad: [**${beatmap.version}** [${beatmap.difficulty_rating}\⭐]](${beatmap.url}) +${mods.join('')}
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
            .setThumbnail(`https://s.ppy.sh/images/${rank}.png`)
            .setTimestamp(new Date(created_at).getTime())],
        components: [buttons, pageButtons],
        files: [{
            name: `${beatmapset.title}.mp3`,
            attachment: `https:${beatmapset.preview_url}`
        }]
    })
}

async function pagesCompactEmbed(res, i2, buttons, pageButtons, page) {
    let p1 = res.data[page]
    let { user, beatmap } = p1
    let mode = beatmap.mode == 'osu' ? 'Standard' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'
    await i2.update({
        embeds: [new EB()
            .setAuthor({
                name: user.username,
                iconURL: user.avatar_url,
                url: `https://osu.ppy.sh/users/${user.id}`
            })
            .setTitle(`Top 10 scores de ${mode}`)
            .setDescription(compactScores(5, res)[page])],
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

function compactScores(pages = 1, res) {
    let score = ''
    var scores = []
    if (pages <= 0) pages = 1
    for (let j = 0; j < pages; j++) {
        for (let i = 10 * j; i < 10 * (j + 1); i++) {
            score += `**${i + 1}.** [${res.data[i].beatmapset.title} (${res.data[i].beatmap.version}) [${res.data[i].beatmap.difficulty_rating}\⭐]](${res.data[i].beatmap.url})
    **${res.data[i].rank}** (+${res.data[i].mods.join('')}) ${(res.data[i].accuracy * 100).toFixed(2)}% | **${(res.data[i].pp).toFixed(2)}pp** <t:${new Date(res.data[i].created_at).getTime() / 1000}:R>\n`
        }
        scores = [...scores, score]
        score = ''
    }

    return scores
}