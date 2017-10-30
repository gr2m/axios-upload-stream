const fs = require('fs')
const FILE_NAME = 'test.png'

const axios = require('axios')
const Hapi = require('hapi')

const server = new Hapi.Server()

server.connection({
  port: 3001
})

server.route({
  method: 'POST',
  path: '/',
  config: {
    payload: {
      output: 'stream'
    }
  },
  handler: function (request, reply) {
    request.payload.pipe(fs.createWriteStream(`upload/${Date.now()}-${FILE_NAME}`))

    reply({ ok: true })
    server.stop()
  }
})

server.start(() => {
  console.log('Server running at:', server.info.uri)

  const readmeStream = fs.createReadStream(FILE_NAME)
  readmeStream.on('error', console.log)

  axios({
    method: 'post',
    url: 'http://localhost:3001',
    data: readmeStream,
    headers: {
      'Content-Type': 'text/markdown'
    }
  }).catch(console.log)
})
