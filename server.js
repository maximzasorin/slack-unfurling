const express = require('express'),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    slackEvents = require('./slack/events'),
    slackWeb = require('./slack/web');

dotenv.load();

slackEvents.APP_VERIFICATION_TOKEN = process.env.APP_VERIFICATION_TOKEN;
slackWeb.APP_TOKEN = process.env.APP_TOKEN;

app = express();

app.use(bodyParser.json());
app.use(slackEvents.middleware());

app.post('/', function (req, res, next) {
    let event = req.body.event;

    switch (event.type) {
        case 'link_shared':
            let unfurls = {};

            for (let link of event.links) {
                unfurls[link.url] = {
                    title: 'Title',
                    text: 'Message body',
                    color: '#E83531',
                    fields: [
                        {
                            title: 'Project',
                            value: 'example.com'
                        }
                    ]
                };
            }

            let data = {
                channel: event.channel,
                ts: event.message_ts,
                unfurls: JSON.stringify(unfurls)
            };

            slackWeb.post('chat.unfurl', data)
                .then(response => {
                    console.log(`success message#${data.ts} unfurling`);
                })
                .catch(error => {
                    console.log(`error message #${data.ts} unfurling`);
                });

            res.sendStatus(200);
        break;

        default:
            res.sendStatus(400);
        break;
    }
});

const server = app.listen(4390, function () {
    const {address, port} = server.address();
    console.log(`Running on http://${address}:${port}`);
});