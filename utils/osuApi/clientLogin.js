import axios from "axios"
import { config } from "dotenv"

config()

export default async function () {
  var auth = await axios({
      method: 'POST',
      url: `https://osu.ppy.sh/oauth/token/`,
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
    return auth.data.access_token
}