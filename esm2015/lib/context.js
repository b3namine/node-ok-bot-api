export class Context {
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
