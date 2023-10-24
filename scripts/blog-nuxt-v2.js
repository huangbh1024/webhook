const qiniu = require('qiniu');
// 读取配置文件
const { accessKey, secretKey, scope } = require('../configs/qiniu').default;

// 上传凭证
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const putPolicy = new qiniu.rs.PutPolicy({ scope });
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();
// 文件上传

const upload = (path, key) => {
  formUploader.putFile(
    uploadToken,
    '_nuxt/' + key,
    path,
    putExtra,
    (respErr, respBody, respInfo) => {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        // console.log(respBody);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    }
  );
};

const basePath = '/www/wwwroot/blog.huangbh.cn/.output/public/_nuxt';
const fs = require('fs');
const main = (path) => {
  const files = fs.readdirSync(path);
  files.forEach((file) => {
    // 判断是否为文件夹
    const isDir = fs.statSync(path + '/' + file).isDirectory();
    if (!isDir) {
      // 上传文件
      upload(path + '/' + file, file);
    } else {
      // 递归
      main(path + '/' + file);
    }
  });
};
main(basePath);
