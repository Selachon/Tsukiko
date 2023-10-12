import axios from "axios";

export default async function (userId, mode, excludeFails) {
  if (!mode) {
    if (!excludeFails) {
      let res = await axios({
        method: 'GET',
        url: `/users/${userId}/scores/recent`,
        params: { limit: 50, include_fails: 1 }
      })
      return res.data
    }
    let res = await axios({
      method: 'GET',
      url: `/users/${userId}/scores/recent`,
      params: { limit: 50 }
    })
    return res.data
  }
  if (!excludeFails) {
    let res = await axios({
      method: 'GET',
      url: `/users/${userId}/scores/recent`,
      params: { limit: 50, mode, include_fails: 1 }
    })
    return res.data
  }
  let res = await axios({
    method: 'GET',
    url: `/users/${userId}/scores/recent`,
    params: { limit: 50, mode }
  })
  return res.data
}