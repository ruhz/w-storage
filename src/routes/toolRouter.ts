import express from 'express'
import archiver from 'archiver'
import multer from 'multer';
// import unzipper from 'unzipper';
import fs from 'fs-extra'
import path from 'path'
import { exec } from 'child_process';


export const toolRouter = express.Router()

const handleDownload = (dirname: string, req: express.Request, res: express.Response) => {
  const zipName = path.join(__dirname, 'data.zip');
  const output = fs.createWriteStream(zipName);
  const archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别
  });

  output.on('close', () => {
    console.log(`压缩完成，总共 ${archive.pointer()} 字节`);
    res.download(zipName, 'data.zip', (err) => {
      if (err) {
        console.error(err);
      } else {
        fs.unlinkSync(zipName); // 下载完成后删除压缩文件
      }
    });
  });

  archive.on('error', (err) => {
    console.error(err);
    res.status(500).send('压缩文件时出错');
  });

  archive.pipe(output)

  archive.directory(dirname, false);

  archive.finalize().catch(err => {
    console.error(err);
    res.status(500).send('压缩文件时出错');
  });
};

toolRouter.get('/download', (req, res) => {
  const dirname = path.join(process.cwd(), 'data')
  handleDownload(dirname, req, res)
})

toolRouter.get('/down/uploads', (req, res) => {
  const dirname = path.join(process.cwd(), 'uploads')
  handleDownload(dirname, req, res)
})

toolRouter.get('/down/extracted', (req, res) => {
  const dirname = path.join(process.cwd(), 'extracted')
  handleDownload(dirname, req, res)
})

toolRouter.get('/down/info', (req, res) => {
  const filename = path.join(process.cwd(), 'info.txt')
  if (!fs.existsSync(filename)) {
    // 获取当前 UTC 时间
    const now = new Date();
    const taipeiOffset = 8 * 60; // 以分钟为单位

    const taipeiTime = new Date(now.getTime() + (taipeiOffset - now.getTimezoneOffset()) * 60 * 1000);
    const taipeiTimeStr = taipeiTime.toISOString().replace('T', ' ').substring(0, 19);
    fs.writeFileSync(filename, taipeiTimeStr)
  }
  res.sendFile(filename);
})

const upload = multer({ dest: 'uploads/' });

toolRouter.post('/upload', upload.single('zipFile'), async (req, res) => {
  res.send('文件上传成功:' + req.file?.filename);
});

toolRouter.post('/upload-extract', upload.single('zipFile'), async (req, res) => {
  if (!req.file) {
    res.end('err.')
    return
  }
  const filePath = req.file.path;
  const targetDir = 'data/';

  unzip(filePath, targetDir)
  res.send('文件上传成功:' + req.file.filename);
})

function unzip(zipFilePath: string, targetDir: string) {
  const outputFolder = 'extracted/'
  const command = `unzip ${zipFilePath} -d ${outputFolder}`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`解压过程中发生错误: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    await fs.copy(outputFolder, targetDir, { overwrite: true });
    // 清理上传的 zip 文件
    // await fs.remove(zipFilePath);
    // await fs.remove(outputFolder);
    console.log(`stdout: ${stdout}`);
    console.log('解压完成！');
  });
}

toolRouter.get('/extract/:filename', async (req, res) => {
  const filePath = path.join('uploads', req.params.filename)
  const targetDir = 'data/';
  unzip(filePath, targetDir)
  res.send('解压成功');
})
