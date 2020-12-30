const _CCLinkJS = require('./lib/CCLinkJS')
const _CCLinkDataProcessing = require('./lib/CCLinkDataProcessing')

const CCLinkJS = new _CCLinkJS()

CCLinkJS.connect()

CCLinkJS._startHeartBeat()