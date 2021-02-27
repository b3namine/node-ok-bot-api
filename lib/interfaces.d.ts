import { OKBotApi } from './index';
export interface Settings {
    token: string;
    url: string;
}
export interface IReceivedMessage {
    webhookType: IWebhookType;
    sender: IReceivedMessageSender;
    recipient: IReceivedMessageRecipient;
    message?: IReceivedTextMessageBody;
    callbackId?: string;
    payload?: string;
    timestamp: number;
}
export interface IReceivedMessageSender {
    name: string;
    user_id: string;
}
export interface IReceivedMessageRecipient {
    chat_id: string;
}
interface IReceivedTextMessageBody {
    text: string;
    seq: number;
    mid: string;
    attachments?: IAttachment | IAttachment[];
}
export interface MessageDataBody {
    webhookType: IWebhookType;
    message: CallbackMessageBody | TextMessageBody;
    info?: {
        sender: IReceivedMessageSender;
        recipient: IReceivedMessageRecipient;
    };
}
export interface CallbackMessageBody {
    callbackId: string;
    payload: string;
}
export interface TextMessageBody {
    text?: string;
    seq?: number;
    mid?: string;
    attachments?: IAttachment | IAttachment[];
}
export interface MessageBody {
    data: MessageDataBody;
    bot: OKBotApi;
}
export interface Message {
    text: string;
    attachment?: IAttachment;
    attachments?: IAttachment[];
    privacyWarning?: IPrivacyWarning;
    reply_to?: string;
}
export interface SendMessageBody {
    recipient?: IRecipient;
    chat_Control?: IChatControl;
    message?: IChatMessage;
}
interface IChatMessage {
    text: string;
    attachment?: IAttachment;
    attachments?: IAttachment[];
}
declare type IChatControl = ChangeChatTitleBody | ChangeChatIconBody | AddMembersToChatBody | RemoveMemberFromChatBody | LeaveChatBody;
interface ChangeChatTitleBody {
    title: string;
}
interface ChangeChatIconBody {
    icons: string;
}
interface AddMembersToChatBody {
    add_members: {
        user_id: string;
    }[];
}
interface RemoveMemberFromChatBody {
    remove_member: {
        user_id: string;
    };
}
interface LeaveChatBody {
    leave: boolean;
}
export interface IRecipient {
    chat_id: string;
}
export interface IAttachment {
    type: IAttachmentType;
    payload: AttachmentPayload;
}
export declare type AttachmentPayload = FilePayload | CallPayload | ImagePayload | VideoPayload | MusicPayload | SharePayload | AudioPayload | StickerPayload | ContactPayload | PresentPayload | LocationPayload | InlineKeyboardPayload;
export declare type IPayload = {
    id: string;
    url: string;
};
export declare type ContextClass = any & MessageBody;
export declare type Next = (ctx?: ContextClass, idx?: number) => boolean;
export declare type Middleware = (ctx: MessageBody, next: Next) => any;
export interface ImagePayload extends IPayload {
}
export interface MusicPayload extends IPayload {
}
export interface StickerPayload extends IPayload {
}
export interface SharePayload extends IPayload {
}
export interface VideoPayload extends IPayload {
    token: string;
}
export interface AudioPayload extends IPayload {
    token: string;
}
export interface FilePayload {
    token: string;
}
export interface ContactPayload {
    name: string;
    phone: string;
    photoUrl: string;
}
export interface LocationPayload {
    latitude: number;
    longitude: number;
    zoom: number;
}
export interface CallPayload {
    id: string;
    type: CallPayloadType;
    hangupType: string;
    duration: number;
}
export interface PresentPayload {
    id: string;
    status: string;
    receiverId: string;
    senderId: string;
}
export interface InlineKeyboardPayload {
    keyboard: InlineKeyboardButtons;
}
export interface InlineKeyboardButtons {
    buttons: InlineKeyboardButton[][];
}
export interface InlineKeyboardButton {
    type: InlineKeyboardButtonType;
    text: string;
    intent: string;
    payload?: string;
    url?: string;
    quick?: boolean;
}
export declare const enum IWebhookType {
    MESSAGE_CREATED = "MESSAGE_CREATED",
    MESSAGE_CALLBACK = "MESSAGE_CALLBACK"
}
export declare const enum InlineKeyboardButtonIntent {
    DEFAULT = "DEFAULT",
    POSITIVE = "POSITIVE",
    NEGATIVE = "NEGATIVE"
}
export declare const enum InlineKeyboardButtonType {
    CALLBACK = "CALLBACK",
    LINK = "LINK",
    REQUEST_CONTACT = "REQUEST_CONTACT",
    REQUEST_GEO_LOCATION = "REQUEST_GEO_LOCATION"
}
export declare const enum CallPayloadType {
    AUDIO = "AUDIO",
    VIDEO = "VIDEO"
}
export declare const enum IPrivacyWarning {
    SCREENSHOT = "SCREENSHOT",
    SCREENCAST = "SCREENCAST"
}
export declare const enum IAttachmentType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    SHARE = "SHARE",
    FILE = "FILE",
    CONTACT = "CONTACT",
    INLINE_KEYBOARD = "INLINE_KEYBOARD",
    LOCATION = "LOCATION",
    MUSIC = "MUSIC",
    CALL = "CALL",
    PRESENT = "PRESENT",
    STICKER = "STICKER"
}
export {};
