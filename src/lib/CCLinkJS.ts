import WebSocket from 'websocket'
import { CCLinkDataProcessing, CCJsonData } from './CCLinkDataProcessing'

interface CCLinkJSOptions {
  url?: string
  usWss?: boolean
  reconnectTimes?: number
  heartbeatInterval?: number
}

/**
 * CCLinkJS - Remake from cclink.js
 * @author hhui64<907322015@qq.com>
 */
class CCLinkJS {
  WebSocket: {
    client: WebSocket.client
    server: WebSocket.server
    socketConnection: WebSocket.connection | null
  }
  cfg: { url: string; useWss: boolean }
  private _heartbeatInterval: NodeJS.Timeout | null = null
  private _listenQueue: Function[]
  constructor(options?: CCLinkJSOptions) {
    this.cfg = {
      url: '//weblink.cc.163.com/',
      useWss: true,
    }
    this.WebSocket = {
      client: new WebSocket.client(),
      server: new WebSocket.server(),
      socketConnection: null,
    }
    this._listenQueue = []
  }

  /**
   * 连接服务器
   */
  public connect(): void {
    this.WebSocket.client.connect((this.cfg.useWss ? 'wss:' : 'ws:') + this.cfg.url)
    this.WebSocket.client.on('connect', (connection: WebSocket.connection) => {
      this._onConnect(connection)
      connection.on('error', (error: Error) => {
        this._onError(error)
      })
      connection.on('close', (code: number, desc: string) => {
        this._onClose(code, desc)
      })
      connection.on('message', (data: WebSocket.IMessage) => {
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
  private _onConnect(connection: WebSocket.connection): void {
    this.WebSocket.socketConnection = connection
    console.info('连接成功')
  }

  /**
   * 连接错误处理方法
   * @param {Error} error
   */
  private _onError(error: Error): void {
    console.info('连接错误: ' + error.toString())
  }

  /**
   * 连接关闭处理方法
   * @param {number} code
   * @param {string} desc
   */
  private _onClose(code: number, desc: string): void {
    this.WebSocket.socketConnection = null
    console.info('连接关闭: ' + code + ' ' + desc)
  }

  /**
   * 消息处理方法
   * @param {WebSocket.IMessage} data
   */
  private _onMessage(data: WebSocket.IMessage): void {
    if (data.binaryData?.byteLength) {
      let Uint8ArrayData = new Uint8Array(data.binaryData),
        unpackData = CCLinkDataProcessing.unpack(Uint8ArrayData).format('json')

      if (unpackData.ccsid === 515) {
        console.info('[接收]', unpackData)
      }
    }
  }

  /**
   * 发送JSON数据
   * cclink.js:0 send(t)
   * @param {CCJsonData} data JSON数据
   */
  public send(data: CCJsonData): void {
    let Uint8ArrayData: Uint8Array = new CCLinkDataProcessing(data).dumps(),
      BufferData: Buffer = Buffer.from(Uint8ArrayData.buffer)
    this.WebSocket.socketConnection && this.WebSocket.socketConnection.sendBytes(BufferData)
    console.info('[发送]', BufferData.length)
  }

  /**
   * @TODO 监听指定接口消息
   * @param ccsid 
   * @param cccid 
   * @param options 
   */
  public listen(ccsid: number, cccid: number, options?: object): void {}

  /**
   * 开始发送心跳包
   */
  private _startHeartBeat(): void {
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
  private _stopHeartBeat(): void {
    this._heartbeatInterval && clearInterval(this._heartbeatInterval)
  }
}

export { CCLinkJS }
