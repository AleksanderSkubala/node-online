const express = require('express')
const next = require('next')
const fs = require('fs')
const { exec } = require('child_process');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express()

  const server = require('http').Server(app)
  const io = require('socket.io')(server)

  io.on('connect', socket => {
    socket.emit('return', {
      message: 'lorem'
    })

    socket.on('code', code => {
      fs.writeFile('./tmp/code.js', code, (err) => {
        if(err) {
          return console.error(err)
        }

        exec('node ./tmp/code.js', (excecErr, stdout, stderr) => {
          const codeOutput = stdout ? stdout : stderr

          socket.emit('return', {
            message: codeOutput
          })
        })

      })
    })
  })

  app.get('/a', (req, res) => {
    return nextApp.render(req, res, '/a', req.query)
  })

  app.get('/b', (req, res) => {
    return nextApp.render(req, res, '/b', req.query)
  })

  app.all('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })

})

