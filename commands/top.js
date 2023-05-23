import { EmbedBuilder as EB, SlashCommandBuilder as SCB } from 'discord.js'
import axios from 'axios'
import { config } from 'dotenv'
import { setTimeout } from 'timers/promises'
const wait = setTimeout
config()

export default {
    data: new SCB()
        .setName('top')
        .setDescription('Mira tus top scores de cualquier modo'),
    category: 'osu!',
    usage: `/top`,
    execute: async (interaction) => {
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
        const res = await axios({
            method: 'GET',
            url: 'https://osu.ppy.sh/api/v2/users/14059324/scores/best',
            headers: {
                Authorization: `Bearer ${auth.data.access_token}`
            }
        })
        let p1 = res.data[0]
        let { user, beatmap, beatmapset, mods, rank, accuracy, weight } = p1
        let mode = beatmap.mode == 'osu' ? 'osu!' : beatmap.mode == 'mania' ? 'Mania' : beatmap.mode == 'fruits' ? 'CTB' : 'Taiko'
        const bigEmbed = new EB()
            .setAuthor({
                name: user.username,
                iconURL: user.avatar_url,
                url: `https://osu.ppy.sh/users/${user.id}`
            })
            .setTitle(`**${beatmapset.title_unicode}** (${beatmapset.title})`)
            .setDescription(`Dificultad: [**${beatmap.version}** [${beatmap.difficulty_rating}\⭐]](${beatmap.url})
Artista: **${beatmapset.artist_unicode}** (${beatmapset.artist})
Mapper: **${beatmapset.creator}**`)
            .setImage(beatmapset.covers['card@2x'])

        var scores = ''
        for (let i = 0; i < res.data.length; i++) {
            scores += `**${i+1}.** [${res.data[i].beatmapset.title} (${res.data[i].beatmap.version}) [${res.data[i].beatmap.difficulty_rating}\⭐]](${res.data[i].beatmap.url})
**${res.data[i].rank}** (+${res.data[i].mods.join('')}) ${(res.data[i].accuracy*100).toFixed(2)}%
**${(res.data[i].weight.pp).toFixed(2)}pp**\n`
        }

        const compactEmbed = new EB()
            .setAuthor({
                name: user.username,
                iconURL: user.avatar_url,
                url: `https://osu.ppy.sh/users/${user.id}`
            })
            .setTitle(`Top 5 scores de ${mode}`)
            .setDescription(scores)
        await interaction.reply({
            content: 'Cargando...'
        })
        await wait(2000)
        await interaction.editReply({
            content: '',
            embeds: [compactEmbed],
            // files: [{
            //     name: `${beatmapset.title}.mp3`,
            //     attachment: `https:${beatmapset.preview_url}`
            // }]
        })
    },
}