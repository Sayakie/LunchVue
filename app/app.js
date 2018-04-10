"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const path = require("path");
const express = require("express");
const compression = require("compression");
const logger = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: '.env' });
const Validator_1 = require("./lib/Validator");
const index_1 = require("./controllers/index");
class App {
    constructor() {
        this.initialization();
        this.configuration();
        this.listen();
        this.routes();
    }
    static bootstrap() {
        return new App();
    }
    initialization() {
        this.express = express();
        this.server = http_1.createServer(this.express);
    }
    configuration() {
        this.port = App.PORT;
        this.express.disable('x-powered-by');
        this.express.set('views', path.join(__dirname, '../views'));
        this.express.set('view engine', 'pug');
        this.express.use(compression());
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use('/assets', express.static(path.join(__dirname, '../assets/dist'), { maxAge: 31557600000 }));
        this.express.use('/', express.static(path.join(__dirname, '../assets/static'), { maxAge: 31557600000 }));
        this.express.use((err, req, res, next) => {
            err.status = 404;
            next(err);
        });
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`[Server] Successfully Listening on ${this.port}`);
        });
        this.server.on('error', (e) => {
            if (e.syscall !== 'listen') {
                throw e;
            }
            const bind = (typeof this.port === 'string') ? `Pipe ${this.port}` : `Port ${this.port}`;
            switch (e.code) {
                case 'EACCES':
                    console.error(`Permission denied. Requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(`${bind} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw e;
            }
        });
    }
    routes() {
        const router = express.Router();
        index_1.IndexRoute.create(router);
        this.express.use(router);
    }
}
App.PORT = Validator_1.default.normalizePort(process.env.PORT || 3000);
const app = App.bootstrap();
exports.default = app;
//# sourceMappingURL=app.js.map