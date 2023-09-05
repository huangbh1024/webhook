const http = require('http');
const createHandler = require('github-webhook-handler');
const handler = createHandler({ path: '/webhook', secret: '19741975m' });

const {
  read_dir,
  run_install,
  run_pull,
  run_build,
  run_pm2,
} = require('./utils/index.js');

http
  .createServer((req, res) => {
    handler(req, res, (err) => {
      res.statusCode = 404;
      res.end('no such location');
    });
  })
  .listen(9999, () => {
    console.log('WebHooks Listern at 9999');
  });

handler.on('push', async (event) => {
  console.log(
    `Received a push event for ${event.payload.repository.name} to ${event.payload.ref}`
  );
  // 项目名以及分支判断
  const projectName = event.payload.repository.name;
  const ref = event.payload.ref;
  // 获取提交信息
  const commits = event.payload.commits;
  const files = commits
    .map((commit) =>
      commit.added.concat(commit.modified).concat(commit.removed)
    )
    .flat();
  const isPackageJson = files.includes('package.json');
  if (ref === 'refs/heads/main') {
    // 执行git pull
    await run_pull(`/home/${projectName}`);
    const versionMap = {
      'yarn.lock': 'yarn',
      'pnpm-lock.yaml': 'pnpm',
      'package-lock.json': 'npm',
    };
    const dirFiles = await read_dir(`/home/${projectName}`);
    const file = dirFiles.find((file) => versionMap[file]);
    const version = versionMap[file];
    if (isPackageJson) {
      // 读取当前项目的目录
      console.log('开始执行install脚本');
      await run_install(`/home/${projectName}`, version);
    } else {
      console.log('package.json文件未修改，不执行install脚本');
    }
    // 执行build
    console.log('开始执行build脚本');
    await run_build(`/home/${projectName}`, version);
    // 执行pm2
    console.log('开始执行pm2脚本');
    await run_pm2(projectName);
  }
});
