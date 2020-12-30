import CCLinkJS from './lib/CCLinkJS'
import CCLinkDataProcessing from './lib/CCLinkDataProcessing'

const cclinkjs = new CCLinkJS()

cclinkjs.connect()
cclinkjs._startHeartBeat()
