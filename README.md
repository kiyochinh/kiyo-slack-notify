# Kiyo slack notify

## How is it used?

First, you have to create a [new Slack application](https://api.slack.com/apps), then go to `Add features and functionality > Incoming Webhooks` and click on `Add New Webhook to Workspace`.

You must properly set the following environment variables: `.env`:

`PORT` - Port of the http server. (Optional) (Default port is 3000) 

`SLACK_WEBHOOK` - your Slack webhook URL
Example: `https://hooks.slack.com/services/foo/bar/foobar123`

`SLACK_BOT_TOKEN`
`CHANNEL` - Channel on Slack

`src/resources/slack_users.json` - nickname mapping from GitHub to Slack

Example:

    {
        "github-username": "slack-display-name",
        "John": "smith",
    }
    
The keys (ex. "Mystraht") correspond to GitHub nicknames, and the values (ex. "John") correspond to Slack nicknames.

Slack have issue with space in nickname, in this case use instead:

    {
        "John-Smith": "john.smith",
        "Jack": {
          id: "SLACK_USER_ID",
          name: "jack"
        },
    }

You can then launch the Node server by running:

    npm install
    npm run start

You will then have to configure your GitHub webhook.

Go to your repository settings, and add a webhook with the following configuration:

    Payload URL: http://<YOUR_DOMAIN_or_IP_ADDRESS>:3000/git/webhook
    Content type: application/json
    Event: Let me select individual events.
        -> Pull request
        -> Pull request review comment
        -> Pull request review
        
## Requirement

This version of Slack pull request notifier is tested with NodeJS LTS.

## Contributing

Feel free to submit a pull request!