import axios from "axios";

export default async function (token) {
  let res = await axios({
    method: 'GET',
    url: `/me`,
    headers: {
      "Content-Type": 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: { limit: 50 }
  })
  return res.data
}