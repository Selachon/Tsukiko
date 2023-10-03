import axios from "axios";

export default async function (beatmapId) {
  return await axios({
    method: 'GET',
    url: `/beatmaps/${beatmapId}`,
    params: { limit: 50 }
  })
}