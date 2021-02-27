import axios from 'axios';
export class SetWebhook {
    constructor(settings) {
        this.settings = settings;
        this.subscribe();
    }
    subscribe() {
        const urls = [];
        axios.get(`https://api.ok.ru/graph/me/subscriptions?access_token=${this.settings.token}`)
            .then((data) => data.data.subscriptions.forEach((subscription) => urls.push(subscription.url)))
            .then(() => !!urls.includes(this.settings.url))
            .then((include) => !include && axios.post(`https://api.ok.ru/graph/me/subscribe?access_token=${this.settings.token}`, { 'url': this.settings.url.toString() }))
            .then((res) => !!res.data ? console.log('Webhook url added') : console.log('Webhook url already exist'))
            .catch((error) => {
            console.log(error);
        });
    }
}
