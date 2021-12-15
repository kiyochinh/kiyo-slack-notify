module.exports = (app) => {
	const baseURL = '/git'

	// API for github webhook
	const gitController = require(appControllers + '/git_controller')
	app.route(baseURL + '/webhook').post(gitController.webhook)
}