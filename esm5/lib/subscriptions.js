import axios from "axios";
var subscriptions = /** @class */ (function () {
    function subscriptions(settings) {
        this.settings = settings;
        this.subscription();
    }
    subscriptions.prototype.subscription = function () {
        axios.get("https://api.ok.ru/graph/me/subscriptions?access_token=" + this.settings.token)
            .then(function (data) { return data.data.subscriptions; })
            .catch(function (error) { return console.log(error); });
    };
    return subscriptions;
}());
export { subscriptions };
