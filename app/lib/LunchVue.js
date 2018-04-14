"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class LunchVue {
    constructor() {
        this.init();
    }
    static bootstrap() {
        return new LunchVue();
    }
    init() {
        this.PREFIX = 'stu.';
        this.SUFFIX = '.go.kr';
        this.TYPE = [
            'sen',
            'pen',
            'dge',
            'ice',
            'gen',
            'dje',
            'use',
            'sje',
            'goe',
            'gwe',
            'cbe',
            'cne',
            'jbe',
            'jne',
            'gbe',
            'gne',
            'jje'
        ];
        this.DOMAIN = [];
        this.DATA = [];
        for (const i in this.TYPE) {
            if (this.TYPE[i] === 'gbe') {
                this.DOMAIN.push(this.PREFIX + this.TYPE[i] + '.kr');
                continue;
            }
            this.DOMAIN.push(this.PREFIX + this.TYPE[i] + this.SUFFIX);
        }
    }
    find(school) {
        this.request2(encodeURIComponent(school));
    }
    request2(school) {
        const promises = [];
        const result = [];
        function process(_domain, query) {
            return __awaiter(this, void 0, void 0, function* () {
                _domain.map(domain => {
                    return promises.push(new Promise((resolve, reject) => {
                        request({
                            rejectUnauthorized: false,
                            uri: `http://${domain}/spr_ccm_cm01_100.do?kraOrgNm=${query}`,
                            headers: {
                                'User-Agent': 'lunchvue-request-bot'
                            },
                            gzip: true,
                            json: true
                        }, (err, res, body) => {
                            if (err) {
                                reject(err);
                            }
                            else if (res.statusCode == 200) {
                                body.resultSVO.orgDVOList.map(school => {
                                    console.log(JSON.stringify({
                                        name: school.kraOrgNm,
                                        code: school.orgCode,
                                        type: school.schulCrseScCodeNm,
                                        address: school.zipAdres
                                    }));
                                    resolve({
                                        name: school.krgOrgNm,
                                        code: school.orgCode,
                                        type: school.schulCrseScCodeNm,
                                        address: school.zipAdres
                                    });
                                });
                            }
                        }).on('error', err => {
                            console.error(`Request failed: ${err}`);
                        });
                    }));
                });
                yield Promise.all(promises)
                    .then(result => {
                    console.log(JSON.stringify(result));
                    return JSON.stringify(result);
                })
                    .catch(err => {
                    return [];
                });
            });
        }
        return process(this.DOMAIN, encodeURIComponent(school));
    }
}
exports.default = LunchVue.bootstrap();
//# sourceMappingURL=LunchVue.js.map