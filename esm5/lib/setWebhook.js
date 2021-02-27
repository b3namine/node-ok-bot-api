import axios from 'axios';
var SetWebhook = /** @class */ (function () {
    function SetWebhook(settings) {
        this.settings = settings;
        this.subscribe();
    }
    SetWebhook.prototype.subscribe = function () {
        var _this = this;
        var urls = [];
        axios.get("https://api.ok.ru/graph/me/subscriptions?access_token=" + this.settings.token)
            .then(function (data) { return data.data.subscriptions.forEach(function (subscription) { return urls.push(subscription.url); }); })
            .then(function () { return !!urls.includes(_this.settings.url); })
            .then(function (include) { return !include && axios.post("https://api.ok.ru/graph/me/subscribe?access_token=" + _this.settings.token, { 'url': _this.settings.url.toString() }); })
            .then(function (res) { return !!res.data ? console.log('Webhook url added') : console.log('Webhook url already exist'); })
            .catch(function (error) {
            console.log(error);
        });
    };
    return SetWebhook;
}());
export { SetWebhook };
