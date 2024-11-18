// 根据report文件, 更新config.yaml，把监听端口转连接到Sing-box去
// 执行目录 C:\software\tool\network\route\20240325
// 编译 tsc --outDir . code\test_singbox_report.ts && node test_singbox_report.js
import {loadConfig, saveConfig, getGroupsConfig} from './common'
import {IReport_item, IClashConfig, IListenerConfig, IProxyConfig} from './common'
import * as yaml from 'js-yaml'
import * as fs from 'fs'

const reportFileName = 'singbox_proxy_test.yaml'

// 主程序入口
loadConfig(reportFileName).then(r => {
    const rr = r as IReport_item[]
    const g = rr.reduce((groups, item) => {
        if (!item.err) {
            groups[item.country_code] = groups[item.country_code] || []
            groups[item.country_code].push(item)
        }
        return groups
    }, {} as Record<string, IReport_item[]>)
    for (let index in g) {
        console.log(`${index} ${g[index].length}`)
    }
    const hks: IReport_item[] = []
    for (let item of subgroup_HK_12(g['HK'])) {
        if (!hks.some(r => r.ip == item.ip))
            hks.push(item)
    }
    console.log('hks: ', hks.length)
    let proxys = getProxies(hks)
    const listeners = getListeners(proxys, 13)
    save(proxys, listeners)
})

// 在集合里面取13个，不够分配循环再分配
function subgroup_HK_12(inbounds: IReport_item[]): IReport_item[] {
    let result: IReport_item[] = []
    let index = 0
    for (let i = 0; i < 14; i++) {
        result.push(inbounds[index])
        index++
        if (inbounds.length == index)
            index = 0
    }
    return result
}

function getProxies(data: IReport_item[]): IProxyConfig[] {
    const result: IProxyConfig[] = []
    for (let index in data) {
        const groupName = 'singbox' + index
        result.push({
            name: groupName,
            type: 'http',
            server: '127.0.0.1',
            port: Number(data[index].name),
        })
    }
    return result
}

function getListeners(proxys: IProxyConfig[], count: number): IListenerConfig[] {
    const result: IListenerConfig[] = []
    let index = 0
    for (let i = 0; i < count; i++) {
        if (index >= proxys.length)
            index = 0
        let port = 7900 + i
        result.push({
            name: "proxy" + port,
            type: "http",
            port: port,
            proxy: proxys[index].name
        })
        index++
    }
    return result
}

function save(proxys: IProxyConfig[], listeners: IListenerConfig[]) {
    Promise.all([
        loadConfig('config.yaml'),
    ]).then(r => {
        let config = r[0] as IClashConfig
        config.proxies = config.proxies.concat(proxys)
        config.listeners = listeners
        let yamlString = yaml.dump(config);
        fs.writeFileSync('./config_singbox.yaml', yamlString, 'utf8');
        console.log('数据已保存到 config_singbox.yaml 文件');
    })
}
