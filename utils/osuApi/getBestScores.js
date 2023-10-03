import axios from "axios";

export default async function (userId) {
  let res = await axios({
    method: 'GET',
    url: `/users/${userId}/scores/best`,
    params: { limit: 50 }
  })
  return res.data
}