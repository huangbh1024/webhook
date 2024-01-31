const { urlMap } = require('../utils/urlMap.js')
const { startUpload } = require('../utils/qiniu.js')

const basePath = `${urlMap['blog-nuxt-v2']}/.output/public/_nuxt`;

startUpload('_nuxt/', basePath)
