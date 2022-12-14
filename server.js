//this js file is using to solve CORS problem by proxy


const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware')

const devProxy = {
    '/api': {
        target: 'http://localhost:5073',
        pathRewrite:{
            '^/api':'/'
        },
        changeOrigin: true
    }
}

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
  const server = express()

  if (dev && devProxy) {
   Object.keys(devProxy).forEach(function(context){
       server.use(createProxyMiddleware(context, devProxy[context]))
   })
   }

  server.all('*', (req, res) => {
   return handle(req, res)
   })
  server.listen(port, (err) => {
   if (err) throw err
   console.log(`> Ready on http://localhost:${port}`)
   })
  })
  .catch((err) => {
  console.log('An error occurred, unable to start the server')
  console.log(err)
  })
