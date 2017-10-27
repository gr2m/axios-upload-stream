const fs = require('fs')
const path = require('path')

const axios = require('axios')
const express = require('express')
const multer = require('multer')

const app = express()
const upload = multer({ dest: path.resolve(__dirname, 'upload') })

app.post('/', upload.single('README.md'), function (req, res) {
  const {
    originalname,
    path: uploadPath
  } = req.file

  console.log(`${originalname} uploaded to ${uploadPath}`)
  res.status(201).json({
    ok: true
  })
})

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('App is listening on port ' + listener.address().port)
  console.log('stop with ctrl + C\n')

  const readmeStream = fs.createReadStream('README.md')
  readmeStream.on('error', console.log)

  // // reference implementation with Mikeal's request
  // const request = require('request')
  // const form = request.post(`http://localhost:${listener.address().port}`).form()
  // form.append('README.md', readmeStream)
  // return

  axios({
    method: 'post',
    url: `https://localhost:${listener.address().port}`,
    headers: {
      'Content-Type': 'text/markdown; charset=UTF-8'
    },
    data: fs.createReadStream('README.md')
  }).then(console.log, console.log)
})
