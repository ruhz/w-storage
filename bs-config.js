const browserSync = require('browser-sync').create();
const exec = require('child_process').exec;

const bsConfig = {
    proxy: 'http://localhost:3000', // 代理本地服务器
    files: ['src/**/*.*'], // 监控 public 目录下的所有文件
    watch: ['src'],
    port: 3001, // BrowserSync 运行的端口
    reloadDelay: 1000, // 延迟刷新时间
    open: false // 不自动打开浏览器
};

browserSync.init(bsConfig, () => {
    // 使用 nodemon 启动服务器并监控 server.js 文件
    // exec('npx nodemon --exec \"npx ts-node\" src/server.ts', (err, stdout, stderr) => {
    const exe = exec('npx ts-node-dev src/server.ts --transpileOnly', (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
    exe.stdout.on("data", (d) => {
        console.log('[server] ', d)
    })
});

// 当 server.js 文件发生变化时，重启服务器
/*
browserSync.watch('src/server.ts').on('change', () => {
    console.log("server.ts change.")
    browserSync.reload();
}); */
