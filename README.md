# CCLinkJS Remake [![Build Status](https://www.travis-ci.com/hhui64/cclinkjs.svg?branch=master)](https://www.travis-ci.com/hhui64/cclinkjs) ![GitHub](https://img.shields.io/github/license/hhui64/cclinkjs) ![GitHub](https://img.shields.io/github/languages/top/hhui64/cclinkjs)

CC 直播前端模块 cclink.js 反混淆项目，该模块主要负责与服务端的通信

## 安装

```bash
npm install cclinkjs --save
```

## 使用

引入并创建一个 CCLinkJS 对象

```javascript
// CommonJS
const CCLinkJS = require('cclinkjs')
// ES6 Moudule
import { CCLinkJS } from 'cclinkjs'

const cclinkjs = new CCLinkJS()

// 连接服务器
cclinkjs.connect()
console.log(cclinkjs.isReady) // true
```

向服务端发送数据

```javascript
// 发送数据
cclinkjs.send({ ccsid: 6144, cccid: 5 })

/**
 * 如担心发送数据时恰巧碰到 connection 失效或尚在连接中
 * 可以通过 options 设置 { cache: true } 来将消息暂时
 * 放入缓存队列中，待 socket 连接成功时会自动将缓存队列
 * 中尚未发送的消息重新发送。
 */
cclinkjs.send({ ccsid: 6144, cccid: 5 }, { cache: true })
```

## 声明

本项目仅供学习使用，禁止用作其它用途，如使用本项目造成的一切问题均与作者无关

## License

[MIT licensed](LICENSE)
