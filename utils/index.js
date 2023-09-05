const { spawn } = require('child_process');
const { readdir } = require('fs');

const run_cmd = (cmd, args, callback) => {
  const child = spawn(cmd, args);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on('close', (code) => {
    callback(code);
  });
};

const run_pull = (path) => {
  const child = spawn('git', ['pull'], { cwd: path });
  return new Promise((resolve) => {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', (code) => {
      console.log(`pull ${path} success`);
      resolve();
    });
  });
};
const run_install = (path, version) => {
  const child = spawn(version, ['install'], { cwd: path });
  return new Promise((resolve) => {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', (code) => {
      console.log(`install ${path} success`);
      resolve();
    });
  });
};
const run_build = (path, version) => {
  const child = spawn(version, ['run', 'build'], { cwd: path });
  return new Promise((resolve) => {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', (code) => {
      console.log(`build ${path} success`);
      resolve();
    });
  });
};
const run_pm2 = (projectName) => {
  const child = spawn('pm2', ['restart', projectName]);
  return new Promise((resolve) => {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', (code) => {
      console.log(`pm2 ${projectName} success`);
      resolve();
    });
  });
};

const read_dir = (path) => {
  return new Promise((resolve) => {
    readdir(path, (err, files) => {
      if (err) {
        console.log(err);
        return;
      }
      resolve(files);
    });
  });
};

module.exports = {
  run_cmd,
  run_pull,
  run_install,
  run_pm2,
  read_dir,
  run_build,
};
