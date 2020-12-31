import WebSocket from 'websocket'
import { CCLinkDataProcessing } from './CCLinkDataProcessing'

/**
 * CCLinkJS - Remake from cclink.js
 * @author hhui64<907322015@qq.com>
 */
export class CCLinkJS {
  WebSocket: {
    client: WebSocket.client
    server: WebSocket.server
    socketConnection: WebSocket.connection | null
  }
  cfg: { url: string; useWss: boolean }
  private _heartbeatInterval: NodeJS.Timeout | null = null
  private _listenQueue: Function[]
  constructor(options?: object) {
    this.cfg = {
      url: '//weblink.cc.163.com/',
      useWss: true,
    }
    this.WebSocket = {
      client: new WebSocket.client(),
      server: new WebSocket.server(),
      socketConnection: null,
    }
    // this._heartbeatInterval = null
    this._listenQueue = []
  }

  /**
   * 连接服务器
   */
  connect() {
    this.WebSocket.client.connect((this.cfg.useWss ? 'wss:' : 'ws:') + this.cfg.url)
    this.WebSocket.client.on('connect', (connection) => {
      this._onConnect(connection)
      connection.on('error', (error) => {
        this._onError(error)
      })
      connection.on('close', (code, desc) => {
        this._onClose(code, desc)
      })
      connection.on('message', (data) => {
        if (data.type === 'binary') {
          this._onMessage(data)
        }
      })
    })
  }

  /**
   * 连接成功处理方法
   * @param {WebSocket.connection} connection
   */
  _onConnect(connection: WebSocket.connection | null) {
    this.WebSocket.socketConnection = connection
    console.info('连接成功')
  }

  /**
   * 连接错误处理方法
   * @param {Error} error
   */
  _onError(error: Error) {
    console.info('连接错误: ' + error.toString())
  }

  /**
   * 连接关闭处理方法
   * @param {Number} code
   * @param {String} desc
   */
  _onClose(code: string | number, desc: string) {
    console.info('连接关闭: ' + code + ' ' + desc)
  }

  /**
   * 消息处理方法
   * @param {WebSocket.IMessage} data
   */
  _onMessage(data: WebSocket.IMessage) {
    let Uint8ArrayData = new Uint8Array(data.binaryData),
      unpackData = CCLinkDataProcessing.unpack(Uint8ArrayData).format('json')

    if (unpackData.ccsid == 515) {
      console.info('[接收]', unpackData)
    }
  }

  /**
   * 发送JSON数据
   * cclink.js:0 send(t)
   * @param {Object} data JSON数据
   */
  send(data: object) {
    let Uint8ArrayData: Uint8Array = new CCLinkDataProcessing(data).dumps(),
      BufferData: Buffer = Buffer.from(Uint8ArrayData.buffer)
    this.WebSocket.socketConnection && this.WebSocket.socketConnection.sendBytes(BufferData)
    console.info('[发送]', BufferData.length)
  }

  /**
   * 开始发送心跳包
   */
  _startHeartBeat() {
    this.send({
      ccsid: 6144,
      cccid: 5,
    })
    this._heartbeatInterval = setInterval(() => {
      this.send({
        ccsid: 6144,
        cccid: 5,
      })
    }, 30000)
  }

  /**
   * 停止发送心跳包
   */
  _stopHeartBeat() {
    this._heartbeatInterval && clearInterval(this._heartbeatInterval)
  }
}

// module.exports = CCLinkJS
