const exec = require('child_process').exec;

const exc = exec('npx ts-node-dev src/server.ts --transpileOnly', (err, stdout, stderr) => {
  console.log("ok")
  if (err) {
      console.error(`exec error: ${err}`);
      return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

exc.stdout.on('data', (data) => {
  console.log('on data:', data)
})

console.log('start.')