// 根据report文件生成生产config.yaml
// 执行目录 C:\software\tool\network\route\20240325
// 编译 tsc --outDir . code\test_report.ts && node test_report.js
import {loadConfig, saveConfig, getGroupsConfig} from './common'
import {IReport_item, IClashConfig, IProxyGroupConfig, IListenerConfig} from './common'
import * as yaml from 'js-yaml'
import * as fs from 'fs'

loadConfig('proxy_test.yaml').then(r => {
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
    const listenerGroups = getGroupsConfig_inbroad(subgroup_HK_12(g))
    const listeners = getListeners(listenerGroups)
    const groups = listenerGroups.concat(getGroupsConfig(subgroup(g)))
    // const listeners = getListeners(groups)
    // save(groups, listeners)
    // const groups = getGroupsConfig(subgroup(g))
    save(groups, listeners)
})

function subgroup(data: Record<string, IReport_item[]>): Record<string, IReport_item[][]> {
    const result: Record<string, IReport_item[][]> = {}
    for (let index in data) {
        let groups: IReport_item[][] = [[], [], [], []]
        while (data[index].length > 0) {
            for (let item of groups) {
                item.push(popRequir(data[index], (a, b) => a.time < b.time))
                console.log(index, item[item.length - 1].time)
                if (data[index].length == 0)
                    break
            }
            if (data[index].length == 0)
                break
            for (let item of groups) {
                item.push(popRequir(data[index], (a, b) => a.time > b.time))
                console.log(item[item.length - 1].time)
                if (data[index].length == 0)
                    break
            }
        }
        result[index] = groups
    }
    return result
}

function subgroup_HK_12(data: Record<string, IReport_item[]>): Record<string, IReport_item[][]> {
    const result: Record<string, IReport_item[][]> = {}
    const data2 = data['HK'].concat()
    let groups: IReport_item[][] = [[], [], [], [], [], [], [], [], [], [], [], [], []]
        while (data2.length > 0) {
            for (let item of groups) {
                item.push(popRequir(data2, (a, b) => a.time < b.time))
                console.log('HK', item[item.length - 1].time)
                if (data2.length == 0)
                    break
            }
            if (data2.length == 0)
                break
            for (let item of groups) {
                item.push(popRequir(data2, (a, b) => a.time > b.time))
                console.log(item[item.length - 1].time)
                if (data2.length == 0)
                    break
            }
        }
        result['inbroad'] = groups
    return result
}

function getGroupsConfig_inbroad(data: Record<string, IReport_item[][]>): IProxyGroupConfig[] {
    const result: IProxyGroupConfig[] = []
    for (let name in data) {
        let groupNames: string[] = []
        for (let index in data[name]) {
            const groupName = name + index
            groupNames.push(groupName)
            result.push({
                name: groupName,
                proxies: data[name][index].map(r => r.name),
                type: 'url-test',
                url: 'http://www.gstatic.com/generate_204',
                interval: 30
            })
        }
    }
    return result
}

function getListeners(groups: IProxyGroupConfig[]): IListenerConfig[] {
    const result: IListenerConfig[] = []
    for (let i = 0; i < groups.length; i++) {
        let port = 7900 + i
        result.push({
            name: "proxy" + port,
            type: "http",
            port: port,
            proxy: groups[i].name
        })
    }
    return result
}

function createConfig() {}

function save(groups: IProxyGroupConfig[], listeners: IListenerConfig[]) {
    Promise.all([
        loadConfig('20240529.yaml'),
        loadConfig('base.yaml'),
        loadConfig('foot.yaml'),
    ]).then(r => {
        let proxys = r[0] as IClashConfig
        let bsc = r[1] as IClashConfig
        let ftc = r[2]
        bsc.proxies = proxys.proxies
        bsc['proxy-groups'] = groups
        if (listeners.length > 0)
            bsc.listeners = listeners
        let result = Object.assign({}, bsc, ftc)
        let yamlString = yaml.dump(result);
        fs.writeFileSync('./config_clash.yaml', yamlString, 'utf8');
        console.log('数据已保存到 config.yaml 文件');
    })
}

/* function save2(proxys: IProxyConfig[], listeners: IListenerConfig[]) {
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
} */

function popRequir(data: IReport_item[], requir: (a: IReport_item, b: IReport_item) => boolean): IReport_item {
    let preValue = data[0]
    let valueIndex = 0
    for (let i = 1; i < data.length; i++) {
        if (!requir(preValue, data[i])) {
            preValue = data[i]
            valueIndex = i
        }
    }
    data.splice(valueIndex, 1)
    return preValue
}

function getTime(data: IReport_item[]): string {
    let result = ''
    for (let item of data) {
        result += ' ' + item.time
    }
    return result
}

function show(data: IReport_item[], country_code): void {
    const f = data.filter(s => s.country_code == country_code)
    for (let t of f) {
        console.log('name: ', t.name, '  ', country_code)
    }
}

function showCount(data: IReport_item[], country_code): void {
    const f = data.filter(s => s.country_code == country_code)
    console.log(country_code, '  ', f.length)
}
