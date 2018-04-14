"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validator {
    static bootstrap() {
        return new Validator();
    }
    normalizePort(val) {
        const port = (typeof val === 'string') ? parseInt(val, 10) : val;
        if (isNaN(port)) {
            return val;
        }
        else if (port >= 0) {
            return port;
        }
        else {
            return false;
        }
    }
    *asyncMiddleware(fn) {
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(next);
        };
    }
}
exports.default = Validator.bootstrap();
//# sourceMappingURL=Validator.js.map