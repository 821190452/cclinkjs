import msgpack from 'msgpack5'
import pako from 'pako'

interface CCJsonData {
  ccsid?: number
  cccid?: number
  [propName: string]: any
}

/**
 * cclink.js 数据处理类
 * @author hhui64<907322015@qq.com>
 */
class CCLinkDataProcessing {
  ccsid: number
  cccid: number
  msgWithOutSidCid: CCJsonData
  constructor(data: CCJsonData) {
    this.ccsid = data.ccsid || 0
    this.cccid = data.cccid || 0
    this.msgWithOutSidCid = data
    delete this.msgWithOutSidCid.ccsid
    delete this.msgWithOutSidCid.cccid
  }

  /**
   * 格式化JSON数据
   * cclink.js:2074 format(t)
   * @param {string} type 格式化类型
   */
  public format(type: string): CCJsonData {
    if (type === 'json') {
      return Object.assign(
        {},
        {
          ccsid: this.ccsid,
          cccid: this.cccid,
        },
        this.msgWithOutSidCid
      )
    }

    // return 'json' == t
    //   ? Object.assign(
    //       {},
    //       {
    //         ccsid: this.ccsid,
    //         cccid: this.cccid,
    //       },
    //       this.msgWithOutSidCid
    //     )
    // : 'string' == t
    // ? JSON.stringify(this)
    // : this

    return {}
  }

  /**
   * 编码数据
   * cclink.js:2082 dumps()
   */
  public dumps(): Uint8Array {
    let msgpackEncodeBufferList = msgpack().encode(this.msgWithOutSidCid),
      msgpackEncodeUint8Array = new Uint8Array(msgpackEncodeBufferList),
      dumpsUint8Array = new Uint8Array(8 + msgpackEncodeUint8Array.byteLength),
      dumpsDataView = new DataView(dumpsUint8Array.buffer)

    dumpsDataView.setUint16(0, this.ccsid, true)
    dumpsDataView.setUint16(2, this.cccid, true)

    msgpackEncodeUint8Array.forEach((t, n) => {
      dumpsUint8Array[8 + n] = t
    })

    return dumpsUint8Array
  }

  /**
   * 解码数据
   * cclink.js:2094 unpack(e)
   * @param {Uint8Array} Uint8ArrayData 原始数据 Uint8Array
   */
  public static unpack(Uint8ArrayData: Uint8Array): CCLinkDataProcessing {
    let n: DataView = new DataView(Uint8ArrayData.buffer),
      ccsid: number = n.getUint16(0, true),
      cccid: number = n.getUint16(2, true),
      o: Uint8Array = new Uint8Array()
    if (n.getUint32(4, true)) {
      let s = n.getUint32(8, true),
        u = new Uint8Array(Uint8ArrayData.buffer, 12)
      u.byteLength === s && (o = pako.inflate(u))
    } else {
      o = new Uint8Array(Uint8ArrayData.buffer, 8)
    }

    let f: object = msgpack().decode(Buffer.from(o))

    return new CCLinkDataProcessing(
      Object.assign(
        {},
        {
          ccsid,
          cccid,
        },
        this.replaceLinkBreak(f)
      )
    )
  }

  /**
   * 过滤JSON数据
   * cclink.js:2113 replaceLinkBreak(t)
   * @param {Object} t 原始数据对象
   */
  public static replaceLinkBreak(t: object | string): object | string {
    return (
      'object' === (void 0 === t ? 'undefined' : typeof t) && (t = JSON.stringify(t)),
      (t = ('' + t).replace(/\\r\\n/g, '')),
      JSON.parse(t)
    )
  }
}

export { CCJsonData, CCLinkDataProcessing }
