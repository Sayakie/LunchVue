"use strict";
const request = require("request");
class LunchVue {
    constructor() {
        this.init();
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
        for (const i in this.TYPE) {
            this.DOMAIN.push(this.PREFIX + this.TYPE[i] + this.SUFFIX);
        }
    }
    find(school) {
        const query = encodeURIComponent(school);
        Object.keys(this.DOMAIN).map((domain, i) => {
            request({
                uri: `https://${domain}/spr_ccm_cm01_100.do?kraOrgNm=${query}`,
                json: true
            }, (err, res, data) => {
                if (err) {
                    throw TypeError(`No such dep: ${err}`);
                }
                data.resultSVO.orgDVOList.map(school => {
                    return {
                        name: school.kraOrgNm,
                        code: school.orgCode,
                        type: school.schulCrseScCodeNm,
                        address: school.zipAdres
                    };
                });
            }).on('error', (err) => {
                throw TypeError(`Request failed: ${err}`);
            });
        });
    }
}
module.exports = LunchVue;
//# sourceMappingURL=LunchVue.js.map