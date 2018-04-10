"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRoute {
    constructor() {
        this.title = "LunchVue";
        this.scripts = [];
    }
    addScript(src) {
        this.scripts.push(src);
        return this;
    }
    render(req, res, view, options) {
        res.locals.BASE_URL = process.env.DOMAIN;
        res.render(view, options);
    }
}
exports.BaseRoute = BaseRoute;
//# sourceMappingURL=route.js.map