"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const path = require("path");
const express = require("express");
const compression = require("compression");
const logger = require("morgan");
const bodyParser = require("body-parser");
class App {
    constructor() {
        this.initialization();
        this.configuration();
        this.listen();
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
        this.express.set('view engine', 'hbs');
        this.express.use(compression());
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use('/assets', express.static(path.join(__dirname, '../assets/dist'), { maxAge: 31557600000 }));
        this.express.use('/', express.static(path.join(__dirname, '../assets/static'), { maxAge: 31557600000 }));
    }
    listen() {
        this.server.listen(this.port, () => {
        });
        this.server.on('error', (e) => {
            if (e.syscall !== 'listen') {
                throw e;
            }
            const bind = (typeof this.port === 'string') ? `Pipe ${this.port}` : `Port ${this.port}`;
            switch (e.code) {
                case 'EACCES':
                    console.error(`Permission denied`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(`${bind} already in use`);
                    process.exit(1);
                    break;
                default:
                    throw e;
            }
        });
    }
}
const app = App.bootstrap();
exports.default = app;
//# sourceMappingURL=app.js.map