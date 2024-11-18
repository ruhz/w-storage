import express from 'express'
import fs from 'fs'
import path from 'path'
import { SnFinance } from '../lib/sn/finance'
import { fmodel } from '../lib/sn/fmodel'


export const stockRouter = express.Router()

stockRouter.get('/test',  (req, res) => {
  const filename = path.join(process.cwd(), 'dist', 'template', 'index.html')
  fs.writeFileSync(filename, 'This is new content.')
  console.log('test write file OK.')
  res.send('test write file OK.')
})

stockRouter.get('/paths', (req, res) => {
  const current = path.join(process.cwd(), 'data')
  const p = fs.readdirSync(current).filter(fl => fs.statSync(path.join(current, fl)).isDirectory());
  res.send(p)
})

stockRouter.get('/files/:spath', (req, res) => {
  const current = path.join(process.cwd(), 'data', req.params.spath)
  const p = fs.readdirSync(current).filter(fl => fs.statSync(path.join(current, fl)).isFile())
  res.send(p.map(m => m.match(/^[^.]+/)?.[0]))
})

stockRouter.get('/file/:spath/:sfile', (req, res) => {
  const filename = path.join(process.cwd(), 'data', req.params.spath, req.params.sfile + '.json')
  console.log('file get OK.')
  res.send(fs.readFileSync(filename, 'utf8'))
})

stockRouter.post('/file/:spath/:sfile', (req, res) => {
  const filename = path.join(process.cwd(), 'data', req.params.spath, req.params.sfile + '.json')
  const data = req.body.toString()
  fs.writeFileSync(filename, data)
  res.send('OK')
})

stockRouter.get('/nav/:symbol', async (req, res) => {
  res.send(await SnFinance.navs(req.params.symbol))
})

const readJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const writeJsonFile = (filePath: string, data: any) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

const updateFundPrices = async (symbol: string, count = 1) => {
  const filePath = path.join(process.cwd(), 'data', 'history', `${symbol}.json`);
  let prices: fmodel.IFundHistory[] = []
  try {
    prices = readJsonFile(filePath);
  } catch (e) {}
  const d = await SnFinance.navs(symbol, count)
  d.forEach(item => {
    const price = { date: SnFinance.fixISOString(item.date).split('T')[0], price: item.jjjz }
    if (prices.every(m => m.date !== price.date)) {
      prices.push(price)
    }
  })
  prices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  writeJsonFile(filePath, prices)
  return prices
};

stockRouter.get('/fund/update', async (req, res) => {
  const filename = path.join(process.cwd(), 'data', 'user', 'name-symbol.json');
  const filename2 = path.join(process.cwd(), 'data', 'user', 'user-symbol.json');
  const funds = readJsonFile(filename) as fmodel.IFoundInfo[];
  const userfunds = readJsonFile(filename2) as fmodel.IUserFoundForm[];
  let pendingPromises: Promise<any>[] = [];

  funds.forEach(fund => {
    pendingPromises.push(updateFundPrices(fund.symbol).then(prices => {
      userfunds.filter(m => m.symbol === fund.symbol).forEach(item => {
        const [p0, p1, p2, p3] = prices.slice(-4).reverse();
        item.price = p0?.price;
        item.rate = `[${p0?.date.slice(-2)}] ${calcPerc(p0?.price, p1?.price)} / ${calcPerc(p1?.price, p2?.price)} / ${calcPerc(p2?.price, p3?.price)}`;
      });
    }));
  });

  await Promise.all(pendingPromises);
  writeJsonFile(filename2, userfunds);
  res.send('OK');
});

stockRouter.get('/fund/history/:symbol/:count', async (req, res) => {
  const symbol = req.params.symbol
  const count = parseInt(req.params.count)
  const filename = path.join(process.cwd(), 'data', 'history', symbol + '.json')
  let funds = readJsonFile(filename) as fmodel.IFundHistory[]
  if (funds.length < count) {
    funds = await updateFundPrices(symbol, count)
  }
  res.send('OK')
})

function calcPerc(num1: number | undefined, num2: number | undefined): number {
  if (num1 == undefined || num2 == undefined || num2 == 0)
    return 0
  const increase = ((num1 - num2) / num2) * 100;
  return parseFloat(increase.toFixed(2))
}

stockRouter.post('/fund/submit/:date', async (req, res) => {
  const txt = req.body.toString()
  let data: fmodel.IUserFoundForm[] = []
  try {
    data = JSON.parse(txt) as fmodel.IUserFoundForm[]
  } catch {
    fs.writeFileSync('debug.log', txt)
    console.log('err text save to: debug.log')
    res.send('err').end()
  }
  const groupBySymbol = data.reduce((group, item) => {
    const { symbol } = item;
    group[symbol] = group[symbol] ?? [];
    group[symbol].push(item);
    return group;
  }, {} as Record<string, fmodel.IUserFoundForm[]>)
  const userFilename = path.join(process.cwd(), 'data', 'user', 'user-symbol.json')
  const userfunds = JSON.parse(fs.readFileSync(userFilename, 'utf8')) as fmodel.IUserFoundForm[]
  for (let sy in groupBySymbol) {
    const filename = path.join(process.cwd(), 'data', 'trade', sy + '.json')
    let trades = [] as fmodel.IUserTrade[]
    try {
      trades = JSON.parse(fs.readFileSync(filename, 'utf8'))
    } catch {
      console.log("read file err:", filename)
    }
    for (let item of groupBySymbol[sy]) {
      if (!item.state || item.orientation == '-')
        continue
      const trade = trades.find(m => m.date == req.params.date && m.user == item.user)
      const amount = item.amount * (item.orientation == '买' ? 1 : -1)
      if (trade != undefined) {
        trade.amount = amount
      } else
        trades.push({ user: item.user, symbol: item.symbol, date: req.params.date, amount })
      const history = `[${req.params.date.split('-').pop()}] ${item.orientation == '沽' ? '-' : ''}${item.amount}`
      const userFund = userfunds.find(m => m.user == item.user && m.name == item.name)
      if (userFund) {
        const a = userFund.trade1?.split(']')
        if (a && a.length > 0 && a[0] == history.split(']')[0]) {
          console.log(item.symbol, ': ', a[0], '| ', userFund.trade1)
          userFund.trade1 = history
        }
        else {
          userFund.trade5 = userFund.trade4
          userFund.trade4 = userFund.trade3
          userFund.trade3 = userFund.trade2
          userFund.trade2 = userFund.trade1
          userFund.trade1 = history
        }
      }
    }
    fs.writeFileSync(filename, JSON.stringify(trades, null, 2))
  }
  fs.writeFileSync(userFilename, JSON.stringify(userfunds, null, 2))
  res.send('OK')
})
