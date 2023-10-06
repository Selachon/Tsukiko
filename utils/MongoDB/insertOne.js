import db from "./Connect.js";

export default async function (userId, osuUsername) {
  const Users = db.collection('Users')

  Users.insertOne({
    userId,
    osu: {
      username: osuUsername
    }
  }).then(res => {
    console.log(res)
  })
}