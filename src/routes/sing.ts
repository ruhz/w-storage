import express from 'express'
import { sing } from '../lib/sing'
import { net } from '../lib/net'

export const singRouter = express.Router()

singRouter.get('/outbound', async (req, res) => {
  const data = await sing.getOutbound()
  res.send(data)
})

singRouter.get('/inbound', async (req, res) => {
  const data = await sing.getInbound_new()
  res.send(data)
})

singRouter.get('/addinbound', async (req, res) => {
  await sing.addInbound()
  const data = await sing.getInbound_new()
  res.send(data)
})

singRouter.get('/batchinbound/:inbounds/:start/:count', async (req, res) => {
  await sing.batchInbound(req.params.inbounds, parseInt(req.params.start), parseInt(req.params.count))
  const data = await sing.getInbound_new()
  res.send(data)
})

singRouter.get('/delinbound/:inbounds', async (req, res) => {
  await sing.delInbound(req.params.inbounds)
  const data = await sing.getInbound_new()
  res.send(data)
})

singRouter.get('/exec/state', async (req, res) => {
  res.send(await sing.getExetState())
})

singRouter.get('/exec/stat', async (req, res) => {
  sing.exetStat()
  res.send('true')
})

singRouter.get('/exec/stop', async (req, res) => {
  sing.exetStop()
  res.send('true')
})

singRouter.get('/merge', (req, res) => {
  sing.exetMerge()
  res.send('OK')
})

singRouter.get('/:symbol', async (req, res) => {
  try {
    const u = 'https://stock.finance.sina.com.cn/fundInfo/api/openapi.php/CaihuiFundInfoService.getNav?symbol=' + req.params.symbol
    const data = await net.wget(u)
    res.send(data)

  } catch {
    res.send({ ip: 'err' })
  }
})

