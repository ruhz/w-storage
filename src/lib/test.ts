/* 生成测试环境 config.yaml, 测试服务端的速度
   执行目录 C:\software\tool\network\route\20240325
   编译 tsc --outDir . code\test.ts && node test.js
   软件安装目录 C:\share\software\nettool\mihomo
   1. 执行test，新增监听端口，监听端口对应每个代理服务器, 生成configy.yaml, 复制到mihomo目录，重启软件
   2. test_proxy测试每一个代理端口号，获取IP地址，地区，和响应时间 生成 report 文件
   3. 根据report文件生成生产config.yaml
*/
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import {loadConfig} from './common'

const inputFileName = '20240529.yaml'
const outputFileName = ''

loadConfig(inputFileName)
    .then(r => {
        save(r.proxies)
    })

async function save(data: ProxyConfig[]) {
    try {
        const [bs, ft] = await Promise.all([
            fs.promises.readFile('base.yaml', 'utf8'),
            fs.promises.readFile('foot.yaml', 'utf8'),
        ]);
        try {
        let bsc = yaml.load(bs) as ClashConfig
        let ftc = yaml.load(ft)
        bsc.proxies = data
        let groupNames = data.filter(d => d.name.includes('香港')).map(n => n.name)
        bsc['proxy-groups'] = []
        bsc['proxy-groups'].push(getGroups(data, 'HK', '香港'))
        bsc['proxy-groups'].push(getGroups(data, 'TW', '台湾'))
        bsc.listeners = getListeners(data)
        let result = Object.assign({}, bsc, ftc)
        let yamlString = yaml.dump(result);
        fs.writeFileSync('./config.yaml', yamlString, 'utf8');
        console.log('数据已保存到 config.yaml 文件');
        } catch (e) {
            console.log(e);
        }
  } catch (err) {
    console.error('Error reading files:', err.message);
  }
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
