require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const port = process.env.PORT
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// global properties
global.appRoot = path.resolve(__dirname + '/src')
global.appControllers = appRoot + '/controllers'
global.appRoutes = appRoot + '/routes'

// Body parse json
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())

// import routes
const gitROute = require(appRoutes + '/git_route')(app)

app.listen(port)
console.log('Server listening on port: ' + port)