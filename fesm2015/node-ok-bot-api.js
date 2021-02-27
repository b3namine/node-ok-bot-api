import { __awaiter } from 'tslib';
import axios from 'axios';
import { createReadStream } from 'fs';

class SetWebhook {
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

class DeleteWebhook {
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

class subscriptions {
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

class Request {
    constructor(...args) {
        // if passed 3 args, than it's express (req, res, next)
        // else koa (ctx, next)a
        if (args.length === 3) {
            this.request = args[0];
            this.response = args[1];
        }
        else {
            this.request = args[0].request;
            this.response = args[0].res;
        }
    }
    get body() {
        return this.request.body;
    }
    set requestResponse(body) {
        this.response.status = 200;
        this.response.statusCode = 200;
        this.response.end(body);
    }
}

class Context {
    constructor({ webhookType, sender, recipient, message, timestamp, callbackId, payload }, bot) {
        if (webhookType === 'MESSAGE_CREATED') {
            this.data = { webhookType, message, info: { sender, recipient } };
        }
        else if (webhookType === 'MESSAGE_CALLBACK') {
            this.data = { webhookType, message: { payload, callbackId }, info: { sender, recipient } };
        }
        else {
            this.data = { webhookType, message };
        }
        this.bot = bot;
    }
}

class OKBotApi {
    constructor(settings) {
        this.webhook = (...args) => {
            const request = new Request(...args);
            if (request.body.webhookType === 'MESSAGE_CREATED'
                || request.body.webhookType === 'MESSAGE_CALLBACK') {
                request.requestResponse = '200 OK';
                this.next(new Context(request.body, this));
                return;
            }
            return request.body;
        };
        this.setWebhook = () => {
            // tslint:disable-next-line:no-unused-expression
            new SetWebhook(Object.assign({}, this.settings));
        };
        this.delWebhook = (url) => {
            // tslint:disable-next-line:no-unused-expression
            new DeleteWebhook(Object.assign({}, this.settings), url);
        };
        this.getSubscriptions = () => {
            // tslint:disable-next-line:no-unused-expression
            new subscriptions(Object.assign({}, this.settings));
        };
        this.api = (method, params = {}) => {
            return new Promise((resolve, reject) => {
                axios.post(`https://api.ok.ru/graph/me/${method}?access_token=${this.settings.token}`, JSON.stringify(Object.assign({}, params)), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(({ data }) => {
                    if (data.error_code) {
                        reject(JSON.stringify(data));
                    }
                    else {
                        resolve(data);
                    }
                }).catch((err) => {
                    console.log(err);
                    reject(typeof err === 'object' ? JSON.stringify(err) : err);
                });
            });
        };
        this.on = (...middlewares) => {
            this.command([], ...middlewares);
        };
        this.command = (givenTriggers, ...middlewares) => {
            const triggers = toArray(givenTriggers)
                .map(item => (item instanceof RegExp ? item : item.toLowerCase()));
            for (const fn of middlewares) {
                const idx = this.middlewares.length;
                this.middlewares.push({
                    triggers,
                    fn: (ctx) => fn(ctx, () => this.next(ctx, idx)),
                });
            }
        };
        this.next = (ctx, idx = -1) => {
            if (this.middlewares.length > idx + 1) {
                const { fn, triggers } = this.middlewares[idx + 1];
                const isTriggered = (triggers || []).some((trigger) => {
                    if ((ctx.data.webhookType === 'MESSAGE_CREATED' && trigger !== 'MESSAGE_CREATED') ||
                        (ctx.data.webhookType === 'MESSAGE_CALLBACK' && trigger !== 'MESSAGE_CALLBACK')) {
                        const message = (ctx.data.message.text || ctx.data.message.payload || '').toLowerCase();
                        if (trigger instanceof RegExp) {
                            return trigger.test(message);
                        }
                        return message === trigger;
                    }
                    return ctx.data.webhookType === trigger;
                });
                if (!triggers ||
                    (!triggers.length && (ctx.data.webhookType === 'MESSAGE_CREATED') ||
                        (!triggers.length && ctx.data.webhookType === 'MESSAGE_CALLBACK')) ||
                    isTriggered) {
                    return fn(ctx);
                }
                return this.next(ctx, idx + 1);
            }
            return false;
        };
        this.sendMessage = (chatId, message, attachments) => {
            return new Promise((resolve, reject) => {
                const messageBody = {
                    recipient: { 'chat_id': chatId },
                    message: {
                        text: message,
                        attachments
                    }
                };
                this.api(`messages/${chatId}`, messageBody)
                    .then((res) => resolve(res))
                    .catch((error) => reject(error));
            });
        };
        this.inlineKeyboard = (buttons) => {
            const keyboardButtons = [];
            buttons.forEach((button) => {
                switch (button.type) {
                    case "CALLBACK" /* CALLBACK */:
                        keyboardButtons.push([{
                                type: "CALLBACK" /* CALLBACK */,
                                text: button.text,
                                intent: button.intent,
                                payload: button.payload
                            }]);
                        break;
                    case "LINK" /* LINK */:
                        keyboardButtons.push([{
                                type: "LINK" /* LINK */,
                                text: button.text,
                                intent: button.intent,
                                url: button.url
                            }]);
                        break;
                    case "REQUEST_CONTACT" /* REQUEST_CONTACT */:
                        keyboardButtons.push([{
                                type: "REQUEST_CONTACT" /* REQUEST_CONTACT */,
                                text: button.text,
                                intent: button.intent
                            }]);
                        break;
                    case "REQUEST_GEO_LOCATION" /* REQUEST_GEO_LOCATION */:
                        keyboardButtons.push([{
                                type: "REQUEST_GEO_LOCATION" /* REQUEST_GEO_LOCATION */,
                                text: button.text,
                                intent: button.intent,
                                quick: button.quick
                            }]);
                        break;
                }
            });
            return {
                type: "INLINE_KEYBOARD" /* INLINE_KEYBOARD */,
                payload: {
                    keyboard: {
                        buttons: toArray(keyboardButtons)
                    }
                }
            };
        };
        this.getUploadServer = (attachmentType = "FILE" /* FILE */) => __awaiter(this, void 0, void 0, function* () {
            const urlPrams = !!attachmentType ? `&type=${attachmentType}` : ``;
            const promise = yield axios.get(`https://api.ok.ru/graph/me/fileUploadUrl?access_token=${this.settings.token}${urlPrams}`).then();
            return promise.data;
        });
        this.uploadFile = ({ url, token }, { fileUrl, filename }) => {
            return new Promise((resolve, reject) => {
                const form = new FormData();
                form.append('file', createReadStream(fileUrl));
                form.getLength((err, length) => {
                    axios.post(url, form, {
                        headers: Object.assign(Object.assign({}, form.getHeaders()), { 'Content-Length': `${length}` })
                    })
                        .then(() => {
                        setTimeout(() => resolve({ filePath: fileUrl, token }), 50);
                    })
                        .catch((error) => reject(error));
                });
            });
        };
        if (!settings) {
            throw new Error('Settings Error');
        }
        else if ((typeof settings === 'object' && !settings.token) ||
            (typeof settings === 'object' && !settings.url)) {
            throw new Error('Settings Error');
        }
        this.middlewares = [];
        this.methods = [];
        if (typeof settings === 'object') {
            this.settings = Object.assign({}, settings);
        }
    }
}
function toArray(value) {
    return Array.isArray(value) ? value : [value];
}

export { OKBotApi, toArray };
