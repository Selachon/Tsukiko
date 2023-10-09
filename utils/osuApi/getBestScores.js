import axios from "axios";

export default async function (userId, mode) {
  if (!mode) {
    let res = await axios({
      method: 'GET',
      url: `/users/${userId}/scores/best`,
      params: { limit: 50 }
    })
    return res.data
  }
  let res = await axios({
    method: 'GET',
    url: `/users/${userId}/scores/best`,
    params: { limit: 50, mode }
  })
  return res.data
}