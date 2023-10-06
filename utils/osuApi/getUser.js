import axios from "axios";

export default async function (user) {
  if (isNaN(user)) {
    try {
      let res = await axios({
        method: 'GET',
        url: `/users/${user}`,
        params: {
          key: 'username'
        }
      })
      return res.data
    } catch (e) {
      return undefined
    }
  }
  try {
    let res = await axios({
      method: 'GET',
      url: `/users/${user}`,
      params: {
        key: 'id'
      }
    })
    return res.data
  } catch (e) {
    return undefined
  }
}
