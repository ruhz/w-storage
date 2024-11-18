/* 测试多个代理的IP地址，地区，和响应时间 生成 report 文件
   执行目录 C:\software\tool\network\route\20240325
   编译 tsc --outDir . code\test_singbox_proxy.ts && node test_singbox_proxy.js
*/
import {IReport_item, saveConfig, loadJSON} from './common'
import {singbox} from './common_singbox'
import axios from 'axios'

interface DataResponse {  
    // 根据你的 API 响应结构定义接口字段  
    country_code: string,
    ip: string
    // ... 其他字段  
}  

const inboundFileName = 'C:/Users/aaa/.local/share/sing-box/inbound.txt'
const reportFileName = 'singbox_proxy_test.yaml'

function wgetProxy(prot: number): Promise<DataResponse> {  
    const proxyConfig = {  
        proxy: {  
            protocol: "http",
            host: '127.0.0.1', // 代理服务器的主机名或IP地址  
            port: prot, // 代理服务器的端口号  
            // 如果你需要认证，可以设置以下属性：  
            // auth: {  
            //   username: 'your-username',  
            //   password: 'your-password'  
            // }  
        }  
    }
    const result = new Promise<DataResponse>((resolve, rejects) => {
        axios.get<DataResponse>('http://api.ip.sb/geoip', proxyConfig)
            .then((r: { data: DataResponse | PromiseLike<DataResponse> }) => resolve(r.data))
            .catch((r: any) => rejects(r))
    })
    return result
}

let running = 0
const reports: IReport_item[] = []
function onFinish(name: string, ip: string, country_code: string, time: number, err: boolean) {
    running--
    reports.push({name: name, ip: ip, country_code: country_code, time: time, err: err})
    if (running > 0)
        return
    saveConfig(reports, reportFileName)
}

loadJSON<singbox.IInboundFile>(inboundFileName)
    .then(r => {
        for (let ib of r.inbounds) {
            let port = ib.listen_port
            if (port == 9999)
                continue
            const t = setTimeout(() => {
                let t0 = new Date().getTime()
                wgetProxy(ib.listen_port)  
                    .then(data => {  
                        const t = new Date().getTime() - t0
                        console.log(ib.tag, '    ', data.ip, '   ', data.country_code, '   ', t); // 打印获取到的数据数组
                        onFinish(port.toString(), data.ip, data.country_code, t, false)
                    })  
                    .catch(error => {  
                        // console.error('An error occurred:', error);
                        console.log(port, '    err')
                        onFinish(port.toString(), '', '', 0, true)
                    });
            }, running * 500)
            running++
        }
    })
