# CCLinkJS Remake

CC 直播前端模块 cclink.js 反混淆项目，该模块主要负责与服务端的通信

## 安装

```bash
npm install cclinkjs --save
```

## 使用

```javascript
// CommonJS
const CCLinkJS = require('cclinkjs')
// ES6 Moudule
import { CCLinkJS } from 'cclinkjs'

const cclinkjs = new CCLinkJS()

// 连接服务器
cclinkjs.connect()

// 发送数据
cclinkjs.send({ ccsid: 6144, cccid: 5 })

```

## 声明

本项目仅供学习使用，禁止用作其它用途，如使用本项目造成的一切问题均与作者无关

## License

[MIT licensed](LICENSE)
