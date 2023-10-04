const { default: axios } = require('axios')
const fs = require('fs')
require('dotenv').config()

module.exports = async function (url) {
  // axios({
  //   url,
  //   method: 'GET'
  // })
  //   .then(res => {
  //     // Image will be stored at this path
  //     const filePath = fs.createWriteStream('./assets/Replay.osr')
  //     res.data.pipe(filePath)
  //     filePath.on('finish', () => {
  //       filePath.close()
  //       console.log('Download Completed')
  //     })
  //   })

}