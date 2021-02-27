import { Settings } from './interfaces';
export declare class DeleteWebhook {
    private settings;
    private url?;
    constructor(settings: Settings, url?: string);
    unsubscribe(): void;
}
