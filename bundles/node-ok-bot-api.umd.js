(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('axios'), require('fs')) :
    typeof define === 'function' && define.amd ? define(['exports', 'tslib', 'axios', 'fs'], factory) :
    (global = global || self, factory(global.nodeOkBotApi = {}, global.tslib, global.axios, global.fs));
}(this, (function (exports, tslib, axios, fs) { 'use strict';

    axios = axios && Object.prototype.hasOwnProperty.call(axios, 'default') ? axios['default'] : axios;

    var SetWebhook = /** @class */ (function () {
        function SetWebhook(settings) {
            this.settings = settings;
            this.subscribe();
        }
        SetWebhook.prototype.subscribe = function () {
            var _this = this;
            var urls = [];
            axios.get("https://api.ok.ru/graph/me/subscriptions?access_token=" + this.settings.token)
                .then(function (data) { return data.data.subscriptions.forEach(function (subscription) { return urls.push(subscription.url); }); })
                .then(function () { return !!urls.includes(_this.settings.url); })
                .then(function (include) { return !include && axios.post("https://api.ok.ru/graph/me/subscribe?access_token=" + _this.settings.token, { 'url': _this.settings.url.toString() }); })
                .then(function (res) { return !!res.data ? console.log('Webhook url added') : console.log('Webhook url already exist'); })
                .catch(function (error) {
                console.log(error);
            });
        };
        return SetWebhook;
    }());

    var DeleteWebhook = /** @class */ (function () {
        function DeleteWebhook(settings, url) {
            this.settings = settings;
            this.url = url;
            this.unsubscribe();
        }
        DeleteWebhook.prototype.unsubscribe = function () {
            var _this = this;
            var urls = [];
            axios.get("https://api.ok.ru/graph/me/subscriptions?access_token=" + this.settings.token)
                .then(function (data) { return data.data.subscriptions.forEach(function (subscription) { return urls.push(subscription.url); }); })
                .then(function () { return !!urls.includes(_this.settings.url); })
                .then(function (include) { return !!include && axios.post("https://api.ok.ru/graph/me/unsubscribe?access_token=" + _this.settings.token, { url: !!_this.url ? _this.url : _this.settings.url }); })
                .then(function (res) { return !!res.data.success ? console.log('Webhook url removed') : console.log('Webhook url not exist'); })
                .catch(function (error) {
                console.log(error);
            });
        };
        return DeleteWebhook;
    }());

    var subscriptions = /** @class */ (function () {
        function subscriptions(settings) {
            this.settings = settings;
            this.subscription();
        }
        subscriptions.prototype.subscription = function () {
            axios.get("https://api.ok.ru/graph/me/subscriptions?access_token=" + this.settings.token)
                .then(function (data) { return data.data.subscriptions; })
                .catch(function (error) { return console.log(error); });
        };
        return subscriptions;
    }());

    var Request = /** @class */ (function () {
        function Request() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
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
        Object.defineProperty(Request.prototype, "body", {
            get: function () {
                return this.request.body;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "requestResponse", {
            set: function (body) {
                this.response.status = 200;
                this.response.statusCode = 200;
                this.response.end(body);
            },
            enumerable: false,
            configurable: true
        });
        return Request;
    }());

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

    var OKBotApi = /** @class */ (function () {
        function OKBotApi(settings) {
            var _this = this;
            this.webhook = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var request = new (Request.bind.apply(Request, tslib.__spreadArray([void 0], args)))();
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
                new SetWebhook(tslib.__assign({}, _this.settings));
            };
            this.delWebhook = function (url) {
                // tslint:disable-next-line:no-unused-expression
                new DeleteWebhook(tslib.__assign({}, _this.settings), url);
            };
            this.getSubscriptions = function () {
                // tslint:disable-next-line:no-unused-expression
                new subscriptions(tslib.__assign({}, _this.settings));
            };
            this.api = function (method, params) {
                if (params === void 0) { params = {}; }
                return new Promise(function (resolve, reject) {
                    axios.post("https://api.ok.ru/graph/me/" + method + "?access_token=" + _this.settings.token, JSON.stringify(tslib.__assign({}, params)), {
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
                _this.command.apply(_this, tslib.__spreadArray([[]], middlewares));
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
                return tslib.__awaiter(_this, void 0, void 0, function () {
                    var urlPrams, promise;
                    return tslib.__generator(this, function (_a) {
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
                            headers: tslib.__assign(tslib.__assign({}, form.getHeaders()), { 'Content-Length': "" + length })
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
                this.settings = tslib.__assign({}, settings);
            }
        }
        return OKBotApi;
    }());
    function toArray(value) {
        return Array.isArray(value) ? value : [value];
    }

    exports.OKBotApi = OKBotApi;
    exports.toArray = toArray;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
