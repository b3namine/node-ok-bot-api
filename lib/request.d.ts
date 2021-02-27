import { IReceivedMessage } from './interfaces';
export declare class Request {
    request: {
        body: IReceivedMessage;
    };
    response: any;
    constructor(...args: any);
    get body(): IReceivedMessage;
    set requestResponse(body: any);
}
