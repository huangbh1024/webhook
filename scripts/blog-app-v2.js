const { urlMap } = require('../utils/urlMap.js')
const { startUpload, deleteFolder } = require('../utils/qiniu.js')

const basePath = `${urlMap['blog-app-v2']}/.next/static`;

deleteFolder('_next').then(() => {
    startUpload(basePath, '_next/static')
})