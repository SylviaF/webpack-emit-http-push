/*
 * @Author: fangsimin
 * @Date:   2018-01-04 11:08:12
 * @Last Modified by:   fangsimin
 * @Last Modified time: 2018-01-04 16:32:26
 *
 * 参考fis
 * receiver.php有极大风险，不可以部署在生产环境
 * 避免413错误：修改服务端的接收文件的大小限制
 */
'use strict';

const upload = require('node-client-upload');
const path = require('path');

let gConfig = {
    // 部署receiver的地址
    receiver: '',
    // 服务器上webpack config文件的绝对地址(线上webpack context)
    toBasePath: ''
};

class WebpackEmitHttpPushPlugin {
    constructor(config = {}) {
        this.config = Object.assign({}, gConfig, config);
    }
    apply(compiler) {
        const outputRootPath = compiler['options']['output']['path'];
        const outputPublicPath = path.relative(compiler['options']['context'], outputRootPath);

        compiler.plugin('after-emit', (compilation, callback) => {
            if (!this.config['receiver'] || !this.config['toBasePath']) {
                return 0;
            }
            let assetKeys = Object.keys(compilation.assets);

            let filelist = assetKeys.reduce((list, key) => {
                if (compilation.assets[key]['emitted'] === true) {
                    let filePath = compilation.assets[key]['existsAt'];
                    let relativePath = path.relative(outputRootPath, filePath);

                    let toPath = path.resolve(this.config['toBasePath'], outputPublicPath, relativePath);

                    list.push(filePath);

                    upload(this.config['receiver'], filePath, {
                        to: toPath
                    }, function (res, body) {
                        console.log('upload to server :', toPath,
                            `${res.statusCode} ${res.statusMessage}`);
                    });
                }
                return list;
            }, []);
            callback();
        });
    }
}

module.exports = WebpackEmitHttpPushPlugin;