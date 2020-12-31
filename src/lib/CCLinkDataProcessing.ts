import msgpack from 'msgpack5'
import pako from 'pako'

interface CCJsonData {
  ccsid: number
  cccid: number
}

interface CCJsonDataMsgWithOutSidCid {
  ccsid?: number
  cccid?: number
}


/**
 * cclink.js 数据处理类
 * @author hhui64<907322015@qq.com>
 */
export class CCLinkDataProcessing {
  ccsid: number
  cccid: number
  msgWithOutSidCid: CCJsonDataMsgWithOutSidCid
  constructor(data: CCJsonData) {
    this.ccsid = data.ccsid
    this.cccid = data.cccid
    this.msgWithOutSidCid = data
    delete this.msgWithOutSidCid.ccsid
    delete this.msgWithOutSidCid.cccid
  }

  /**
   * 格式化JSON数据
   * cclink.js:2074 format(t)
   * @param {String} t 数据类型: json/string
   */
  format(t: object | string) {
    return 'json' == t
      ? Object.assign(
          {},
          {
            ccsid: this.ccsid,
            cccid: this.cccid,
          },
          this.msgWithOutSidCid
        )
      : 'string' == t
      ? JSON.stringify(this)
      : this
  }

  /**
   * 编码数据
   * cclink.js:2082 dumps()
   */
  dumps(): Uint8Array {
    let msgPackEncodeBuffer = new Uint8Array(msgpack().encode(this.msgWithOutSidCid)),
      msgPackEncodeBufferUint8Array = new Uint8Array(8 + msgPackEncodeBuffer.byteLength),
      msgPackEncodeBufferUint8ArrayDataView = new DataView(msgPackEncodeBufferUint8Array.buffer)
    msgPackEncodeBufferUint8ArrayDataView.setUint16(0, this.ccsid, true)
    msgPackEncodeBufferUint8ArrayDataView.setUint16(2, this.cccid, true)
    msgPackEncodeBuffer.forEach((t, n) => {
      msgPackEncodeBufferUint8Array[8 + n] = t
    })
    return msgPackEncodeBufferUint8Array
  }

  /**
   * 解码数据
   * cclink.js:2094 unpack(e)
   * @param {Uint8Array} Uint8ArrayData 原始数据 Uint8Array
   */
  static unpack(Uint8ArrayData: Uint8Array) {
    let n = new DataView(Uint8ArrayData.buffer),
      ccsid = n.getUint16(0, true),
      cccid = n.getUint16(2, true),
      o = null
    if (n.getUint32(4, true)) {
      let s = n.getUint32(8, true),
        u = new Uint8Array(Uint8ArrayData.buffer, 12)
      u.byteLength === s && (o = pako.inflate(u))
    } else {
      o = new Uint8Array(Uint8ArrayData.buffer, 8)
    }

    let f = msgpack().decode(o)
    //console.info(f)

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
  static replaceLinkBreak(t: object | string): object | string {
    return (
      'object' === (void 0 === t ? 'undefined' : typeof t) && (t = JSON.stringify(t)),
      (t = ('' + t).replace(/\\r\\n/g, '')),
      JSON.parse(t)
    )
  }
}

// module.exports = CCLinkDataProcessing
