var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { SetWebhook } from './setWebhook';
import { DeleteWebhook } from './delWebhook';
import axios from 'axios';
import { subscriptions } from './subscriptions';
import { Request } from './request';
import { Context } from './context';
import * as fs from 'fs';
var OKBotApi = /** @class */ (function () {
    function OKBotApi(settings) {
        var _this = this;
        this.webhook = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var request = new (Request.bind.apply(Request, __spreadArray([void 0], args)))();
            if (request.body.webhookType === 'MESSAGE_CREATED'
                || request.body.webhookType === 'MESSAGE_CALLBACK') {
                request.requestResponse = '200 OK';
                _this.next(new Context(request.body, _this));
                return;
            }
            return request.body;
        };
        this.setWebhook = function () {
            // tslint:disable-next-line:no-unused-expression
            new SetWebhook(__assign({}, _this.settings));
        };
        this.delWebhook = function (url) {
            // tslint:disable-next-line:no-unused-expression
            new DeleteWebhook(__assign({}, _this.settings), url);
        };
        this.getSubscriptions = function () {
            // tslint:disable-next-line:no-unused-expression
            new subscriptions(__assign({}, _this.settings));
        };
        this.api = function (method, params) {
            if (params === void 0) { params = {}; }
            return new Promise(function (resolve, reject) {
                axios.post("https://api.ok.ru/graph/me/" + method + "?access_token=" + _this.settings.token, JSON.stringify(__assign({}, params)), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (_a) {
                    var data = _a.data;
                    if (data.error_code) {
                        reject(JSON.stringify(data));
                    }
                    else {
                        resolve(data);
                    }
                }).catch(function (err) {
                    console.log(err);
                    reject(typeof err === 'object' ? JSON.stringify(err) : err);
                });
            });
        };
        this.on = function () {
            var middlewares = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                middlewares[_i] = arguments[_i];
            }
            _this.command.apply(_this, __spreadArray([[]], middlewares));
        };
        this.command = function (givenTriggers) {
            var middlewares = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middlewares[_i - 1] = arguments[_i];
            }
            var triggers = toArray(givenTriggers)
                .map(function (item) { return (item instanceof RegExp ? item : item.toLowerCase()); });
            var _loop_1 = function (fn) {
                var idx = _this.middlewares.length;
                _this.middlewares.push({
                    triggers: triggers,
                    fn: function (ctx) { return fn(ctx, function () { return _this.next(ctx, idx); }); },
                });
            };
            for (var _a = 0, middlewares_1 = middlewares; _a < middlewares_1.length; _a++) {
                var fn = middlewares_1[_a];
                _loop_1(fn);
            }
        };
        this.next = function (ctx, idx) {
            if (idx === void 0) { idx = -1; }
            if (_this.middlewares.length > idx + 1) {
                var _a = _this.middlewares[idx + 1], fn = _a.fn, triggers = _a.triggers;
                var isTriggered = (triggers || []).some(function (trigger) {
                    if ((ctx.data.webhookType === 'MESSAGE_CREATED' && trigger !== 'MESSAGE_CREATED') ||
                        (ctx.data.webhookType === 'MESSAGE_CALLBACK' && trigger !== 'MESSAGE_CALLBACK')) {
                        var message = (ctx.data.message.text || ctx.data.message.payload || '').toLowerCase();
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
                return _this.next(ctx, idx + 1);
            }
            return false;
        };
        this.sendMessage = function (chatId, message, attachments) {
            return new Promise(function (resolve, reject) {
                var messageBody = {
                    recipient: { 'chat_id': chatId },
                    message: {
                        text: message,
                        attachments: attachments
                    }
                };
                _this.api("messages/" + chatId, messageBody)
                    .then(function (res) { return resolve(res); })
                    .catch(function (error) { return reject(error); });
            });
        };
        this.inlineKeyboard = function (buttons) {
            var keyboardButtons = [];
            buttons.forEach(function (button) {
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
        this.getUploadServer = function (attachmentType) {
            if (attachmentType === void 0) { attachmentType = "FILE" /* FILE */; }
            return __awaiter(_this, void 0, void 0, function () {
                var urlPrams, promise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urlPrams = !!attachmentType ? "&type=" + attachmentType : "";
                            return [4 /*yield*/, axios.get("https://api.ok.ru/graph/me/fileUploadUrl?access_token=" + this.settings.token + urlPrams).then()];
                        case 1:
                            promise = _a.sent();
                            return [2 /*return*/, promise.data];
                    }
                });
            });
        };
        this.uploadFile = function (_a, _b) {
            var url = _a.url, token = _a.token;
            var fileUrl = _b.fileUrl, filename = _b.filename;
            return new Promise(function (resolve, reject) {
                var form = new FormData();
                form.append('file', fs.createReadStream(fileUrl));
                form.getLength(function (err, length) {
                    axios.post(url, form, {
                        headers: __assign(__assign({}, form.getHeaders()), { 'Content-Length': "" + length })
                    })
                        .then(function () {
                        setTimeout(function () { return resolve({ filePath: fileUrl, token: token }); }, 50);
                    })
                        .catch(function (error) { return reject(error); });
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
            this.settings = __assign({}, settings);
        }
    }
    return OKBotApi;
}());
export { OKBotApi };
export function toArray(value) {
    return Array.isArray(value) ? value : [value];
}
