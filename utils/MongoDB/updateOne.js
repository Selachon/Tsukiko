import db from "./Connect.js";

export default async function (userId, osuUsername) {
  const Users = db.collection('Users')

  await Users.updateOne({ userId }, {
    $set: { osu: { username: osuUsername } }
  })

  const data = await Users.findOne({ userId })

  return data
}