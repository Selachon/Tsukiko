const fs = require('fs')
const downloader = require('./downloader.cjs')
const WritestreamWrapper = require('./WritestreamWrapper.cjs')
require('dotenv').config()

module.exports = async function ({
  apiKey, userId, beatmapId, beatmapHash, mode, mods, outputFile
}) {
  const data = await downloader.download(apiKey, userId, beatmapId, beatmapHash, mode, mods)

  // create output stream
  let out
  if (!outputFile) {
    return
  } else {
    out = new WritestreamWrapper(fs.createWriteStream(outputFile), true)
  }

  // write the data
  out.writeOsrData(data)

  // close the stream
  out.end()
}