const request = require('request')

function pushNotify(payload, slackWebhook) {
    const options = {
        uri: slackWebhook,
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
        }
    }
    request(options)
}

function getSlackUser(users, githubName, shouldGetId = false) {
    const user = users[githubName]
    if (typeof(user) === 'string')
        return user
    if (shouldGetId)
        return user.id
    else
        return user.name
}

function getMentionUsers(author, users) {
    var mentions = ""
    for (e in users) {
        if (author != e)
            mentions += "`<@" + users[e] + ">`,"
    }
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": mentions
        }
    }
}

function pullRequestOpenedMessage(pullRequest, users) {
    return {
        "blocks": [{
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `Anh em nghỉ tay uống miếng nước, ăn miếng bánh rồi quẹo vào <${pullRequest.html_url}|pull #${pullRequest.number}> của bro <@${getSlackUser(users, pullRequest.user.login, true)}> review phát nha :cool-doge:`
            }
        }, {
            "type": "divider"
        }, {
            "type": "context",
            "elements": [{
                "type": "image",
                "image_url": `${pullRequest.user.avatar_url}`,
                "alt_text": "images"
            }, {
                "type": "mrkdwn",
                "text": `${pullRequest.user.login}`
            }]
        }, {
            "type": "context",
            "elements": [{
                "type": "plain_text",
                "text": `${pullRequest.title}`,
                "emoji": true
            }]
        }, {
            "type": "context",
            "elements": [{
                "type": "plain_text",
                "text": `↳ Branch: ${pullRequest.head.label}`,
                "emoji": true
            }]
        }, {
            "type": "context",
            "elements": [{
                "type": "mrkdwn",
                "text": `↳ Pull request: ${pullRequest.html_url}`
            }]
        }, {
            "type": "divider"
        }, getMentionUsers(pullRequest.user.login, users), {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "🚀 Are you ok?"
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Ok Review Luôn",
                    "emoji": true
                },
                "value": "click_me_123",
                "url": `${pullRequest.html_url}`,
                "action_id": "button-action"
            }
        }]
    }
}

function pullRequestClosedMessage(pullRequest, users) {
    return {
        "blocks": [{
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `<${pullRequest.html_url}|Pull #${pullRequest.number}> của bro <@${getSlackUser(users, pullRequest.user.login, true)}> đã được *merged* vào branch \`${pullRequest.base.label}\` :gandalf-pls:`
            }
        }, {
            "type": "image",
            "image_url": "https://media.giphy.com/media/bKBM7H63PIykM/giphy.gif",
            "alt_text": "inspiration"
        }, {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "→ *Đề nghị* update ngay vào Ticket luôn nhé!!!"
            }
        }]
    }
}

function formatMessage(body, users) {
    try {
        switch (body.action) {
            case 'opened':
                return pullRequestOpenedMessage(body.pull_request, users)
            case 'closed':
                return pullRequestClosedMessage(body.pull_request, users)
            default:
                return null
        }
    } catch (error) {
        return null
    }
}

function handleRequest(configs, req, res) {
    try {
        const payload = formatMessage(req.body, configs.users)
        if (payload) {
            pushNotify(payload, configs.slack_webhook)
            res.status(200).json({
                message: 'success'
            })
        } else {
            res.status(500).json({
                message: 'failed'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'failed'
        })
    }
}

module.exports = (() => {
    const router = {}

    router.hizaiOSWebhook = (req, res) => {
       handleRequest(require('../resources/config_ios_hiza.json'), req, res)
    }

    router.hizaDevAllBEWebhook = (req, res) => {
       handleRequest(require('../resources/config_dev_all_be_hiza.json'), req, res)
    }

    router.hizaDevAllAndroidWebhook = (req, res) => {
       handleRequest(require('../resources/config_dev_all_android_hiza.json'), req, res)
    }

    return router
})()