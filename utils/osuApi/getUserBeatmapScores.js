import axios from "axios";

export default async function (beatmapId, userId) {
  let res = await axios({
    method: 'GET',
    url: `/beatmaps/${beatmapId}/scores/users/${userId}/all`
  })
  return res.data
}