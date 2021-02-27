import axios from 'axios';
export class DeleteWebhook {
    constructor(settings, url) {
        this.settings = settings;
        this.url = url;
        this.unsubscribe();
    }
    unsubscribe() {
        const urls = [];
        axios.get(`https://api.ok.ru/graph/me/subscriptions?access_token=${this.settings.token}`)
            .then((data) => data.data.subscriptions.forEach((subscription) => urls.push(subscription.url)))
            .then(() => !!urls.includes(this.settings.url))
            .then((include) => !!include && axios.post(`https://api.ok.ru/graph/me/unsubscribe?access_token=${this.settings.token}`, { url: !!this.url ? this.url : this.settings.url }))
            .then((res) => !!res.data.success ? console.log('Webhook url removed') : console.log('Webhook url not exist'))
            .catch((error) => {
            console.log(error);
        });
    }
}
