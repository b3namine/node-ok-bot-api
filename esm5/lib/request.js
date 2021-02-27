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
export { Request };
