import { config } from "dotenv"
import download from "../download.cjs"
import { setTimeout as wait } from 'timers/promises'
import { unlinkSync } from 'fs'
config()

export default async function (Tsukiko, score, user) {
  if (score.replay) {
    await download({
      apiKey: process.env.OSU_API_KEY,
      userId: user.id,
      beatmapId: score.beatmap.id,
      mode: score.mode,
      outputFile: `./assets/replay-osu_${score.beatmap.id}_${score.best_id}.osr`
    }).catch(err => {
      console.error(err)
      process.exitCode = 1
    })
    await wait(2000)
    let channel = Tsukiko.channels.cache.get('1159973525889761370')
    let replayMsg = await channel.send({
      files: [{
        name: `replay-osu_${score.beatmap.id}_${score.best_id}.osr`,
        attachment: `./assets/replay-osu_${score.beatmap.id}_${score.best_id}.osr`
      }]
    })
    let replay = replayMsg.attachments.first()
    await wait(500)
    unlinkSync(`./assets/replay-osu_${score.beatmap.id}_${score.best_id}.osr`)
    return replay
  }
}