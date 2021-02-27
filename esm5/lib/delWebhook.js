import axios from 'axios';
var DeleteWebhook = /** @class */ (function () {
    function DeleteWebhook(settings, url) {
        this.settings = settings;
        this.url = url;
        this.unsubscribe();
    }
    DeleteWebhook.prototype.unsubscribe = function () {
        var _this = this;
        var urls = [];
        axios.get("https://api.ok.ru/graph/me/subscriptions?access_token=" + this.settings.token)
            .then(function (data) { return data.data.subscriptions.forEach(function (subscription) { return urls.push(subscription.url); }); })
            .then(function () { return !!urls.includes(_this.settings.url); })
            .then(function (include) { return !!include && axios.post("https://api.ok.ru/graph/me/unsubscribe?access_token=" + _this.settings.token, { url: !!_this.url ? _this.url : _this.settings.url }); })
            .then(function (res) { return !!res.data.success ? console.log('Webhook url removed') : console.log('Webhook url not exist'); })
            .catch(function (error) {
            console.log(error);
        });
    };
    return DeleteWebhook;
}());
export { DeleteWebhook };
