import db from "./Connect.js";

export default async function () {
  const LatestMap = db.collection('LatestMap')

  const beatmap = await LatestMap.findOne({ _id: '1' })

  if (!beatmap) return

  return beatmap
}