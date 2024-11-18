// 执行目录 C:\software\tool\network\route\20240325
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const inputFileName = '20240325.yaml'

export function loadConfig(fileName: string): Promise<any> {  
    const result = new Promise<IClashConfig>((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                console.error('读取文件时出错：', err);
                reject(err)
                return
            }
            resolve(yaml.load(data) as any)
        });
    })
    return result
}

export function saveConfig(data: any, fileName: string): void {
    const yamlString = yaml.dump(data)
    fs.writeFileSync(fileName, yamlString, 'utf8')
}

export interface IReport_item {
    name: string,
    ip: string,
    country_code: string,
    time: number,
    err: boolean
}

export function getGroupsConfig(data: Record<string, IReport_item[][]>): IProxyGroupConfig[] {
    const result: IProxyGroupConfig[] = []
    for (let name in data) {
        let groupNames: string[] = []
        for (let index in data[name]) {
            const proxies = data[name][index].map(r => r.name)
            if (proxies.length == 0)
                break
            const groupName = name + index
            groupNames.push(groupName)
            result.push({
                name: groupName,
                proxies: proxies,
                type: 'url-test',
                url: 'http://www.gstatic.com/generate_204',
                interval: 30
            })
        }
        if (groupNames.length == 0)
            continue
        result.push({
            name: name,
            proxies: groupNames,
            type: 'load-balance',
            url: 'http://www.gstatic.com/generate_204',
            interval: 30
        })
    }
    return result
}

export function loadJSON<T>(fileName: string): Promise<T> {  
    const result = new Promise<T>((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                console.error('读取文件时出错：', err);
                reject(err)
                return
            }
            resolve(JSON.parse(data) as T)
        });
    })
    return result
}

export function saveJSON(data: any, fileName: string) {
    fs.writeFileSync(fileName, JSON.stringify(data), 'utf8')
}

function load(data: string): IClashConfig {
    let d = yaml.load(data) as IClashConfig
    return d
}

async function save(data: IProxyConfig[]) {
    try {
        const [bs, ft] = await Promise.all([
            fs.promises.readFile('base.yaml', 'utf8'),
            fs.promises.readFile('foot.yaml', 'utf8'),
        ]);
        try {
            let bsc = yaml.load(bs) as IClashConfig
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

function getGroups(proxies: IProxyConfig[], name: string, tal: string): IProxyGroupConfig {
    const groupNames = proxies.filter(d => d.name.includes(tal)).map(n => n.name)
    return {
        name: name,
        proxies: groupNames,
        type: 'url-test',
        url: 'http://www.gstatic.com/generate_204',
        interval: 30
    }
}

function getListeners(proxies: IProxyConfig[]): IListenerConfig[] {
    const result: IListenerConfig[] = []
    for (let i = 0; i < proxies.length; i++) {
        let port = 7500 + i
        result.push({
            name: "proxy" + port,
            type: "http",
            port: port,
            proxy: proxies[i].name
        })
    }
    return result
}

export interface IClashConfig {
    port: number
    'socks-port': number
    proxies: IProxyConfig[]
    'proxy-groups': IProxyGroupConfig[]
    listeners: IListenerConfig[]
}

export interface IProxyConfig {
    name: string
    type: string
    server: string
    port: number
}

export interface IProxyGroupConfig {
    name: string
    proxies: string[]
    type: string
    url: string
    interval: number
}

export interface IListenerConfig {
    name: string
    type: string
    port: number
    proxy: string
}
