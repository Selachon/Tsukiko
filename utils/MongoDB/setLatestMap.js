import db from "./Connect.js";

export default async function (beatmapId) {
  const LatestMap = db.collection('LatestMap')

  const beatmap = await LatestMap.findOne({ _id: '1' })

  if (!beatmap) return

  LatestMap.updateOne(beatmap, { $set: { id: beatmapId } })
  return
}