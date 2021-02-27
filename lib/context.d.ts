import { OKBotApi } from './index';
import { IReceivedMessage, MessageDataBody } from './interfaces';
export declare class Context {
    data: MessageDataBody;
    bot: OKBotApi;
    constructor({ webhookType, sender, recipient, message, timestamp, callbackId, payload }: IReceivedMessage, bot: OKBotApi);
}
