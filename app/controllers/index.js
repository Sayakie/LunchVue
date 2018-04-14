"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const LunchVue_1 = require("../lib/LunchVue");
class IndexRoute extends route_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        console.log('[IndexRoute] Creating index route.');
        router.get('/', (req, res) => {
            new IndexRoute().index(req, res);
        });
        router.get('/find/:school', (req, res) => {
            new IndexRoute().find(req, res);
        });
    }
    index(req, res) {
        let options = {
            'test': 'Test me XD!!'
        };
        this.render(req, res, 'index', options);
    }
    find(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.json(LunchVue_1.default.request2(req.params.school));
    }
}
exports.IndexRoute = IndexRoute;
//# sourceMappingURL=index.js.map