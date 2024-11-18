/* 生成测试环境 config.yaml, 测试服务端的速度
   执行目录 C:\share\software\tool\network\route\20240325
           C:\share\software\nettool\route\20240325
   编译 tsc --outDir . code\test_singbox.ts && node test_singbox.js
   软件运行目录 bash /C/share/software/nettool/route/singbox.sh
   重新执行步骤
   1. 执行下载singbox及配置文件 inbound.txt, outbound.txt, rule.txt
      (C:\Users\aaa\.local\share\sing-box)
   2. 执行test_singbox，新增监听端口，监听端口对应每个代理服务器
   3. inbound.txt, rule.txt 改名字，重启服务, 之后可以在inbound.txt看到代理端口列表
   4. test_singbox_proxy测试每一个代理端口号，获取IP地址，地区，和响应时间 生成 report 文件
   5. test_singbox_report根据report文件, 更新config.yaml，把监听端口转连接到Sing-box去
*/
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import {loadJSON, saveJSON} from './common'

const outboundFileName = 'C:/Users/aaa/.local/share/sing-box/outbound.txt'
const inboundFileName = 'C:/Users/aaa/.local/share/sing-box/inbound.txt'
const saveInboundFileName = 'C:/Users/aaa/.local/share/sing-box/inbound_new.txt'
const routeFileName = 'C:/Users/aaa/.local/share/sing-box/rule.txt'
const saveRouteFileName = 'C:/Users/aaa/.local/share/sing-box/rule_new.txt'

interface ISingBox {
    outbounds: IOuntbound[],
    inbounds: IInbound[],
    route: IRoute,
}

interface IOuntbound {
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

/*
"type": "mixed",
      "tag": "mixed-in",
      "listen": "::",
      "listen_port": 9999
*/

loadJSON<ISingBox>(outboundFileName)
    .then(r => {
        save(r.outbounds)
    })

function save(data: IOuntbound[]) {
    const d: IOuntbound[] = []
    for (let ob of data) {
        if (ob.type != 'trojan' && ob.type != 'vmess')
            continue
        console.log(ob.tag)
        d.push(ob)
    }
    console.log('count: ', d.length)
    const ibs = saveInbound(d.length)
    saveRoute(d, ibs)
}

function saveInbound(count: number): IInbound[] {
    const d: IInbound[] = []
    const result: IInbound[] = []
    d.push({
        type: "mixed",
        tag: "mixed-in",
        listen: "::",
        listen_port: 9999
    })
    for (let i = 0; i < count; i++) {
        const ib = {
            type: "mixed",
            tag: "mixed-in" + (i + 1),
            listen: "::",
            listen_port: 9901 + i
        }
        d.push(ib)
        result.push(ib)
    }
    saveJSON({inbounds: d}, saveInboundFileName)
    return result
}

function saveRoute(obs: IOuntbound[], ibs: IInbound[]) {
    const routes: IRouteItem[] = []
    for (let index in obs) {
        routes.push({
            inbound: ibs[index].tag,
            outbound: obs[index].tag
        })
    }
    loadJSON<IRule>(routeFileName)
    .then(r => {
        r.route.rules = routes.concat(r.route.rules)
        saveJSON(r, saveRouteFileName)
    })
}

function getGroups(proxies: ProxyConfig[], name: string, tal: string): ProxyGroupConfig {
    const groupNames = proxies.filter(d => d.name.includes(tal)).map(n => n.name)
    return {
        name: name,
        proxies: groupNames,
        type: 'url-test',
        url: 'http://www.gstatic.com/generate_204',
        interval: 30
    }
}

function getListeners(proxies: ProxyConfig[]): ListenerConfig[] {
    const result: ListenerConfig[] = []
    for (let i = 0; i < proxies.length; i++) {
        let port = 7500 + i
        result.push({
            name: proxies[i].name,
            type: "http",
            port: port,
            proxy: proxies[i].name
        })
    }
    return result
}

interface ClashConfig {
    port: number
    'socks-port': number
    proxies: ProxyConfig[]
    'proxy-groups': ProxyGroupConfig[]
    listeners: ListenerConfig[]
}

interface ProxyConfig {
    name: string
    type: string
}

interface ProxyGroupConfig {
    name: string
    proxies: string[]
    type: string
    url: string
    interval: number
}

interface ListenerConfig {
    name: string
    type: string
    port: number
    proxy: string
}
