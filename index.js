const http = require('http');
const createHandler = require('github-webhook-handler');
const handler = createHandler({ path: '/webhook', secret: '19741975m' });

const run_cmd = (cmd, args, callback) => {
  const spawn = require('child_process').spawn;
  const child = spawn(cmd, args);
  let resp = '';
  child.stdout.on('data', (buffer) => {
    resp += buffer.toString();
  });
  child.stdout.on('end', () => {
    callback(resp);
  });
};

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
handler.on('push', (event) => {
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref
  );
  // 项目名以及分支判断
  const project = event.payload.repository.name;
  const ref = event.payload.ref;
  // 获取提交信息
  const commits = event.payload.commits;
  // 判断package.json是否更改  added modified removed
  const files = commits
    .map((commit) =>
      commit.added.concat(commit.modified).concat(commit.removed)
    )
    .flat();
  const isPackageJson = files.includes('package.json');
  if (ref === 'refs/heads/main') {
    console.log(`开始执行${project}的脚本`);
    run_cmd('sh', [`./scripts/${project}.sh`, isPackageJson], (text) => {
      console.log(text);
    });
  }
});
