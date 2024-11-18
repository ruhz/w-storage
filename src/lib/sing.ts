import { exec, spawn } from 'child_process'
import { Io } from './io'

const exetPath = process.env.USERPROFILE + '\\.local\\bin\\sing-box.exe'
const filePath = process.env.USERPROFILE + '\\.local\\share\\sing-box'
const inboundFileName = filePath + '\\inbound.txt'
const outboundFileName = filePath + '\\outbound.txt'
const ruleFileName = filePath + '\\rule.txt'
const configFileName = filePath + '\\config.txt'

export namespace sing {
  export async function getExetState(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // 检查 sing-box 是否正在运行
      exec('tasklist | findstr sing-box', (error, stdout, stderr) => {
        if (error) {
          console.error(`未检测到 sing-box 运行: ${error.message}`)
          resolve(error.message)
        }

        if (stdout) {
          console.log('sing-box 正在运行')
          const regex = /\s+(\d+)\sConsole/;
          const match = stdout.match(regex);
          resolve(match ? match[1] : '')
        } else {
          console.log('sing-box 未运行')
          resolve('false')
        }
      })
    })
  }

  export function exetMerge() {
    const areg = ['merge', configFileName, '-c', ruleFileName, '-c', inboundFileName, '-c', outboundFileName]
    const child = spawn(exetPath, areg, { detached: true, stdio: 'ignore' })
  }
  
  export function exetStat() {
    const areg = ['run', '-c', configFileName, '-D', filePath]
    const child = spawn(exetPath, areg, { detached: true, stdio: 'ignore' })

    /*
    exec(`${exetPath} run -c ${configFileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`错误输出: ${stderr}`);
        return;
      }
      console.log(`输出: ${stdout}`);
    }); */
  }

  export function exetStop() {
    // 关闭 sing-box
    exec('taskkill /IM sing-box.exe /F', (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error.message}`);
        return;
      }
      console.log(stdout)
      console.log('sing-box 进程已终止');
    });

  }

  export function getInbound(): Promise<ISingCfg> {
    return Io.loadCfg<ISingCfg>(inboundFileName)
  }

  export function getOutbound(): Promise<ISingCfg> {
    return Io.loadCfg<ISingCfg>(outboundFileName)
  }

  export async function addInbound() {
    const pout = Io.loadCfg<ISingCfg>(outboundFileName)
    const pin = Io.loadCfg<ISingCfg>(inboundFileName)
    await Promise.all([pout, pin]).then(r => {
      const inbounds = r[1].inbounds
      if (inbounds.length > 1)
        return
      const outbounds = r[0].outbounds.filter(m => m.type == 'trojan' || m.type == 'vmess')
      const new_inbound: IInbound_new[] = []
      const count = outbounds.length
      for (let i = 0; i < count; i++) {
        const ib = {
          type: "mixed",
          tag: "mixed-in" + (i + 1),
          listen: "::",
          listen_port: 9901 + i
        }
        inbounds.push(ib)
        new_inbound.push({
          type: "mixed",
          tag: "mixed-in" + (i + 1),
          listen: "::",
          listen_port: 9901 + i,
          outbound: outbounds[i].tag
        })
      }
      Io.saveJSON({ inbounds: inbounds }, inboundFileName)
      const routes: IRouteItem[] = []
      for (let item of new_inbound) {
        routes.push({
          inbound: item.tag,
          outbound: item.outbound
        })
      }
      Io.loadCfg<IRule>(ruleFileName)
        .then(r => {
          r.route.rules = routes.concat(r.route.rules)
          Io.saveJSON(r, ruleFileName)
        })
    })
  }

  export async function batchInbound(batch: string, start: number, count: number) {
    const batchTags = batch.split(',')
    const prule = Io.loadCfg<IRule>(ruleFileName)
    const pin = Io.loadCfg<ISingCfg>(inboundFileName)
    await Promise.all([prule, pin]).then(async r => {
      const old_route = r[0]
      const inbounds = r[1].inbounds
      const rules = old_route.route.rules.filter(m => batchTags.some(n => n == m.inbound))
      if (inbounds.length == 0)
        return
      const new_inbound: IInbound_new[] = []
      let rule_index = 0
      for (let i = 0; i < count; i++) {
        if (rule_index >= rules.length)
          rule_index = 0
        const port = start + i
        const ib = {
          type: "mixed",
          tag: "mixed-in" + port,
          listen: "::",
          listen_port: port
        }
        inbounds.push(ib)
        new_inbound.push({
          type: "mixed",
          tag: "mixed-in" + port,
          listen: "::",
          listen_port: port,
          outbound: rules[rule_index].outbound
        })
        rule_index++
      }
      await Io.saveJSON({ inbounds: inbounds }, inboundFileName)
      const new_routes: IRouteItem[] = []
      for (let item of new_inbound) {
        new_routes.push({
          inbound: item.tag,
          outbound: item.outbound
        })
      }
      old_route.route.rules = new_routes.concat(old_route.route.rules)
      Io.saveJSON(old_route, ruleFileName)
    })
  }

  export async function delInbound(batch: string) {
    const batchTags = batch.split(',')
    const prule = Io.loadCfg<IRule>(ruleFileName)
    const pin = Io.loadCfg<ISingCfg>(inboundFileName)
    await Promise.all([prule, pin]).then(async r => {
      const old_route = r[0]
      let inbounds = r[1].inbounds
      old_route.route.rules = old_route.route.rules.filter(m => batchTags.every(n => n != m.inbound))
      await Io.saveJSON(old_route, ruleFileName)
      inbounds = inbounds.filter(m => batchTags.every(n => n != m.tag))
      Io.saveJSON({ inbounds: inbounds }, inboundFileName)
    })
  }

  export function getInbound_new(): Promise<IInbound_new[]> {
    return new Promise<IInbound_new[]>((resolve, reject) => {
      Promise.all([Io.loadCfg<ISingCfg>(inboundFileName), Io.loadCfg<IRule>(ruleFileName)]).then(r => {
        const inbounds = r[0].inbounds
        const rules = r[1].route.rules
        const result: IInbound_new[] = []
        for (let item of inbounds) {
          const outbound = rules.find(rl => rl.inbound == item.tag)?.outbound || ''
          result.push({
            type: item.type,
            tag: item.tag,
            listen: item.listen,
            listen_port: item.listen_port,
            outbound: outbound
          })
        }
        resolve(result)
      })
    })
  }

  interface ISingCfg {
    outbounds: IOutbound[],
    inbounds: IInbound[]
  }

  interface IOutbound {
    "type": string,
    "tag": string,
    "outbounds": string[],
  }

  interface IInbound {
    "type": string,
    "tag": string,
    "listen": string,
    "listen_port": number
  }

  interface IInbound_new extends IInbound {
    'outbound': string
  }

  interface IRule {
    route: IRoute
  }

  interface IRoute {
    rules: IRouteItem[],
    routes_set: [],
    auto_detect_interface: boolean
  }

  interface IRouteItem {
    inbound: string,
    outbound: string,
  }
}