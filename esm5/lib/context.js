var Context = /** @class */ (function () {
    function Context(_a, bot) {
        var webhookType = _a.webhookType, sender = _a.sender, recipient = _a.recipient, message = _a.message, timestamp = _a.timestamp, callbackId = _a.callbackId, payload = _a.payload;
        if (webhookType === 'MESSAGE_CREATED') {
            this.data = { webhookType: webhookType, message: message, info: { sender: sender, recipient: recipient } };
        }
        else if (webhookType === 'MESSAGE_CALLBACK') {
            this.data = { webhookType: webhookType, message: { payload: payload, callbackId: callbackId }, info: { sender: sender, recipient: recipient } };
        }
        else {
            this.data = { webhookType: webhookType, message: message };
        }
        this.bot = bot;
    }
    return Context;
}());
export { Context };
