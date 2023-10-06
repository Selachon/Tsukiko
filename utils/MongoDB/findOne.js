import db from "./Connect.js";

export default async function (userId) {
  const Users = db.collection('Users')

  const user = await Users.findOne({ userId })

  if (!user) return

  return user
}