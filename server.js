const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express()

  const server = require('http').Server(app)
  const io = require('socket.io')(server)

  io.on('connect', socket => {
    socket.emit('now', {
      message: 'lorem'
    })

    socket.on('code', code => {
      console.log(code)
      socket.emit('now', {
        message: 'workin'
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

