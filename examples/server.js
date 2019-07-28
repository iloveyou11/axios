const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const path = require('path')
require('./server2')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
        colors: true,
        chunks: false
    }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname, {
    setHeaders(res) {
        res.cookie('XSRF-TOKEN-D', '1234abc')
    }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())

const router = express.Router()
app.use(router)

registerBaseRouter()
registerSimpleRouter()
registerErrorRouter()
registerExtendRouter()

function registerBaseRouter() {
    router.get('/base/get', function(req, res) {
        res.json(req.query)
    })
    router.post('/base/post', function(req, res) {
        res.json(req.body)
    })
    router.post('/base/buffer', function(req, res) {
        let msg = []
        res.on('data', chunk => {
            if (chunk) {
                msg.push(chunk)
            }
        })
        res.on('end', () => {
            let buf = Buffer.concat(msg)
            res.json(buf.toJSON())
        })
    })
}

function registerSimpleRouter() {
    router.get('/simple/get', function(req, res) {
        res.json({
            msg: `hello world`
        })
    })
}

function registerErrorRouter() {
    router.get('/error/get', function(req, res) {
        if (Math.random() > 0.5) {
            res.json({
                msg: 'error'
            })
        } else {
            res.status(500)
            res.end()
        }
    })
    router.get('/error/timeout', function(req, res) {
        setTimeout(() => {
            res.json({
                msg: `hello world`
            })
        }, 3000)
    })
}

function registerExtendRouter() {
    router.get('/extend/get', function(req, res) {
        res.json({
            msg: 'hello world'
        })
    })

    router.options('/extend/options', function(req, res) {
        res.end()
    })

    router.delete('/extend/delete', function(req, res) {
        res.end()
    })

    router.head('/extend/head', function(req, res) {
        res.end()
    })

    router.post('/extend/post', function(req, res) {
        res.json(req.body)
    })

    router.put('/extend/put', function(req, res) {
        res.json(req.body)
    })

    router.patch('/extend/patch', function(req, res) {
        res.json(req.body)
    })

    router.get('/extend/user', function(req, res) {
        res.json({
            code: 0,
            message: 'ok',
            result: {
                name: 'jack',
                age: 18
            }
        })
    })
}

const port = process.env.PORT || 8000
module.exports = app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
})