const qiniu = require("qiniu");
const fs = require('fs')

const { accessKey, secretKey, scope } = require("../configs/qiniu");

// 上传凭证
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const putPolicy = new qiniu.rs.PutPolicy({ scope });
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
const bucketManage = new qiniu.rs.BucketManager(mac, config);

const formUploader = new qiniu.form_up.FormUploader(config);

// 上传
const upload = (baseFolder, path, key, mimetype) => {
    const putExtra = new qiniu.form_up.PutExtra(key, {}, mimetype);
    formUploader.putFile(
        uploadToken,
        baseFolder + key,
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
}

// 删除储存桶的文件夹
const deleteFolder = (path) => {
    const deleteOperations = [];
    bucketManage.listPrefix(scope, { prefix: path }, (err, result, res) => {
        const { items } = result;
        items.forEach((item) => {
            deleteOperations.push(qiniu.rs.deleteOp(scope, item.key));
        });
        bucketManage.batch(deleteOperations, (err, respBody, respInfo) => {
            if (err) {
                throw err;
            }
            if (respInfo.statusCode == 200) {
                console.log(respBody);
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
        });
    });
};

const startUpload = (basePath, baseFolder) => {
    const files = fs.readdirSync(basePath);
    files.forEach((file) => {
        // 判断是否为文件夹
        const isDir = fs.statSync(basePath + "/" + file).isDirectory();
        if (!isDir) {
            // 文件后缀
            const extname = file.split(".").pop();
            // 只会上传js和css文件
            const mimetype = extname === "js" ? "text/javascript" : "text/css";
            // 上传文件
            upload(baseFolder, basePath + "/" + file, file, mimetype);
        } else {
            // 递归
            startUpload(basePath + "/" + file);
        }
    });
}

module.exports = { startUpload }