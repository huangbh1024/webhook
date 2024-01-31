const { urlMap } = require('../utils/urlMap.js')
const { startUpload } = require('../utils/qiniu.js')

const basePath = `${urlMap['blog-app-v2']}/.next/static`;

startUpload(basePath, '_next/static')
