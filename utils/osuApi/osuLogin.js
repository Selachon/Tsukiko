import axios from "axios"
import { config } from "dotenv"
import https from 'https'

config()

export default async function (code) {
  var auth = await axios({
    url: `https://osu.ppy.sh/oauth/token/`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/x-www-form-urlencoded'
    },
    data: {
      client_id: process.env.OSU_CLIENT_ID,
      client_secret: process.env.OSU_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:8080'
    }
  })
  axios.defaults.timeout = 60000
  axios.defaults.httpsAgent = new https.Agent({
    keepAlive: true
  })
  
  return auth.data.access_token
}