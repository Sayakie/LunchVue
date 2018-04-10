"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
class IndexRoute extends route_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        console.log('[IndexRoute::Create] Creating index route.');
        router.get('/', (req, res, next) => {
            new IndexRoute().index(req, res, next);
        });
    }
    index(req, res, next) {
        let options = {
            'title': 'LunchVue ─ 전국 급식 식단표',
            "message": "Hi, this is test msg"
        };
        this.render(req, res, 'index', options);
    }
}
exports.IndexRoute = IndexRoute;
//# sourceMappingURL=index.js.map