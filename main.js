import express from 'express'
const app = express()
import fs from 'fs'
import { config } from 'dotenv'
config()

// const app = require('express')()
// const fs = require('fs').promises
// require('dotenv').config()

const PORT = process.env.PORT

app.get("", (req, res) => {
    fs.readFile('./main.html', (err, contents) => {
        if (err) {
            res.writeHead(500)
            res.end(err)
            return
        }
        res.setHeader("Content-Type", "text/html")
        res.writeHead(200)
        res.end(contents)
    })

    var codeParam = String(req._parsedUrl.query)
    fs.writeFileSync('./utils/code.js', `export default {
    code: '${getCode(codeParam)}'
}`)

})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

function getCode(codeParam) {
    let code = codeParam.replace('code=', '')
    return code
}

export default { status: 'OK' }