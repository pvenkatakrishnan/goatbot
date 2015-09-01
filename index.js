var autoReconnect = true;
var autoMark = true;
var Slack = require('slack-client');
var slack = new Slack('xoxb-10031965443-ZhIeB0uUjFgSXzyNCgqqbiz9', autoReconnect, autoMark);
var app = require('express')();
var sayings = require('./goats');
slack.on('message', function(message) {

    var channel, channelError, channelName, errors, response, text, textError, ts, type, typeError, user, userName;
    channel = slack.getChannelGroupOrDMByID(message.channel);
    type = message.type, ts = message.ts, text = message.text;
    if (type === 'message' && (text != null) && (channel != null)) {
        text = text.toLowerCase();
        console.info('text', text);

        //just to keep confucius active do some random activity
        if (Math.random() > 0.7) {
            var keys = Object.keys(sayings);
            var item = keys[Math.floor(Math.random() * keys.length)];
            channel.send(sayings[item]);
        }
    } else {
        typeError = type !== 'message' ? "unexpected type " + type + "." : null;
        textError = text == null ? 'text was undefined.' : null;
        channelError = channel == null ? 'channel was undefined.' : null;
        errors = [typeError, textError, channelError].filter(function(element) {
            return element !== null;
        }).join(' ');
        return console.log("@" + slack.self.name + " could not respond. " + errors);
    }
});

slack.on('error', function(error) {
    return console.error("Error: " + error);
});

slack.login();
var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.info("listening on ", port);
});