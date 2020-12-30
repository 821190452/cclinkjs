import WebSocket from 'websocket'
import CCLinkDataProcessing from './CCLinkDataProcessing'

/**
 * CCLinkJS - Remake from cclink.js
 * @author hhui64<907322015@qq.com>
 */
class CCLinkJS {
  constructor(options) {
    this.cfg = {
      url: '//weblink.cc.163.com/',
      useWss: true,
    }
    this.WebSocket = {
      client: new WebSocket.client(),
      server: new WebSocket.server(),
      /**
       * @type {WebSocket.connection} WebSocket会话
       */
      socketConnection: null,
    }
    this._heartbeatInterval = null
    /**
     * @type {Function[]} 消息监听方法队列
     */
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
  _onConnect(connection) {
    this.WebSocket.socketConnection = connection
    console.info('连接成功')
  }

  /**
   * 连接错误处理方法
   * @param {Error} error
   */
  _onError(error) {
    console.info('连接错误: ' + error.toString())
  }

  /**
   * 连接关闭处理方法
   * @param {Number} code
   * @param {String} desc
   */
  _onClose(code, desc) {
    console.info('连接关闭: ' + code + ' ' + desc)
  }

  /**
   * 消息处理方法
   * @param {WebSocket.IMessage} data
   */
  _onMessage(data) {
    let Uint8ArrayData = new Uint8Array(data.binaryData),
      unpackData = CCLinkDataProcessing.unpack(Uint8ArrayData).format('json')

    console.info('[接收]', unpackData)
  }

  /**
   * 发送JSON数据
   * cclink.js:0 send(t)
   * @param {Object} data JSON数据
   */
  send(data) {
    let Uint8ArrayData = new CCLinkDataProcessing(data).dumps()
    this.WebSocket.socketConnection && this.WebSocket.socketConnection.sendBytes(Buffer.from(Uint8ArrayData.buffer))
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
    }, 5000)
  }

  /**
   * 停止发送心跳包
   */
  _stopHeartBeat() {
    clearInterval(this._heartbeatInterval)
  }
}

module.exports = CCLinkJS
