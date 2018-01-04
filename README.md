# webpack emit-after时的plugin

用于开发环境中，将生成的文件发布到服务端，方便我们用本机开发

## 关于文件接收器 receiver.php（使用fis3的receiver.php）

**此代码存在很大的安全隐患，没有做任何安全考虑，请不要部署到线上服务。**

## 安装
```
npm install webpack-emit-http-push --save-dev
```

## 用法
```
const webpackEmitHttpPushPlugin = require('webpack-emit-http-push');
```

```
plugins: [
    new webpackEmitHttpPushPlugin({
        receiver: 'http://XXX/receiver.php',
        toBasePath: '/home/XXX' // webpack执行地的绝对地址
    })
]
```

