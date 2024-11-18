import express from 'express'
import { net } from './lib/net'
import { stockRouter } from './routes/stock'
import { singRouter } from './routes/sing'
import { toolRouter } from './routes/toolRouter'

const app = express();

app.use(express.raw({ type: 'text/plain' })) // 处理post数据插件

// app.use(bodyParser.json()) // 处理post第三方数据插件

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 或者指定特定的域名
  console.log(req.url)
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.options('*', (req, res) => {
  // res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // res.set('Access-Control-Allow-Credentials', 'true');
  res.end();
})

app.use('/stock', stockRouter)

app.use('/sing', singRouter)

app.use('/tool', toolRouter)

// 定义一个简单的路由
app.get('/', (req, res) => {
  console.log("requer /, ", __dirname)
  // res.send('Hello World15!');
  res.sendFile(__dirname + '/template/index.html');
});

app.get('/ip/:port', async (req, res) => {
  try {
    const data = await net.wgetProxy(parseInt(req.params.port))
    res.send(data)
  
  } catch {
    res.send({ ip: 'err' })
  }
})

export default app
