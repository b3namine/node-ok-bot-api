import axios from "axios";
export class subscriptions {
    constructor(settings) {
        this.settings = settings;
        this.subscription();
    }
    subscription() {
        axios.get(`https://api.ok.ru/graph/me/subscriptions?access_token=${this.settings.token}`)
            .then((data) => data.data.subscriptions)
            .catch((error) => console.log(error));
    }
}
