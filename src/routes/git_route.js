module.exports = (app) => {
    // API for github webhook
    const gitController = require(appControllers + '/git_controller')
    app.route('/hiza/git-ios/webhook').post(gitController.hizaiOSWebhook)
    app.route('/hiza/git-dev-all-android/webhook').post(gitController.hizaDevAllAndroidWebhook)
    app.route('/hiza/git-dev-all-be/webhook').post(gitController.hizaDevAllBEWebhook)
}