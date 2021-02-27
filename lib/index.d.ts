import { ContextClass, IAttachment, IAttachmentType, InlineKeyboardButton, IReceivedMessage, MessageBody, Middleware, SendMessageBody, Settings } from './interfaces';
export declare class OKBotApi {
    middlewares: any[];
    methods: any[];
    settings: Settings;
    constructor(settings: string | Settings);
    webhook: (...args: any) => IReceivedMessage;
    setWebhook: () => void;
    delWebhook: (url?: string) => void;
    getSubscriptions: () => void;
    api: (method: string, params?: SendMessageBody) => Promise<void>;
    on: (...middlewares: Middleware[]) => void;
    command: (givenTriggers: string | string[], ...middlewares: ContextClass[]) => void;
    next: (ctx: MessageBody, idx?: number) => boolean | void;
    sendMessage: (chatId: string, message: string, attachments?: IAttachment[]) => Promise<void>;
    inlineKeyboard: (buttons: InlineKeyboardButton[]) => IAttachment;
    getUploadServer: (attachmentType?: IAttachmentType) => Promise<any>;
    uploadFile: ({ url, token }: any, { fileUrl, filename }: any) => Promise<any>;
}
export declare function toArray(value: any): any[];
