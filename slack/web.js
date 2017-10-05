const axios = require('axios'),
    querystring = require('querystring');

class SlackWeb {
    constructor() {
        this.APP_TOKEN = null;
    }

    post(method, params) {
        let data = querystring.stringify(
            Object.assign({ token: this.APP_TOKEN }, params)
        );

        return axios.post('https://slack.com/api/' + method, data);
    }
};

module.exports = new SlackWeb;