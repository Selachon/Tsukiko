import axios from "axios";

export default async function (user) {
  let res = await axios({
    method: 'GET',
    url: `/users/${user}`,
    params: { limit: 50 }
  })
  return res.data
}