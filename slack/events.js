class SlackEvents {
    constructor() {
        this.APP_VERIFICATION_TOKEN = null;
    }

    middleware() {
        return (req, res, next) => {
            if (!this.APP_VERIFICATION_TOKEN) {
                return res.sendStatus(500);
            }

            if (req.body.token != this.APP_VERIFICATION_TOKEN) {
                return res.sendStatus(400);
            }

            if (req.body.type == 'url_verification') {
                return res.json({ challange: req.body.challenge });
            }

            next();
        }
    }
};

module.exports = new SlackEvents;