const fs = require('fs')
const https = require('https')

module.exports = function (url) {
  https.get(url, (res) => {
    // Image will be stored at this path
    const filePath = fs.createWriteStream('./assets/Replay.osr')
    res.pipe(filePath)
    filePath.on('finish', () => {
      filePath.close()
      console.log('Download Completed')
    })
  })

}