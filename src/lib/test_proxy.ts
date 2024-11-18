/* 测试多个代理的IP地址，地区，和响应时间 生成 report 文件
   执行目录 C:\software\tool\network\route\20240325
   编译 tsc --outDir . code\test_proxy.ts && node test_proxy.js
*/
import {loadConfig, saveConfig, IReport_item} from './common'
import axios from 'axios'

const reportFileNmae = 'proxy_test.yaml'

interface DataResponse {  
    // 根据你的 API 响应结构定义接口字段  
    country_code: string,
    ip: string
    // ... 其他字段  
}  
  
async function fetchDataThroughProxy(prot: number): Promise<DataResponse> {  
    try {  
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
        };  
    
        const response = await axios.get<DataResponse>('http://api.ip.sb/geoip', proxyConfig)
        return response.data; // 返回获取到的数据数组  
    } catch (error) {  
        // console.error('Error fetching data through proxy:', error);  
        throw error; // 重新抛出错误，以便在调用此函数的地方处理  
    }
}

loadConfig('config.yaml').then(r => {
    if (r.listeners.length == 0)
        return
    let running = 0
    const reports: IReport_item[] = []
    const onFinish = (name: string, ip: string, country_code: string, time: number, err: boolean) => {
        running--
        reports.push({name: name, ip: ip, country_code: country_code, time: time, err: err})
        if (running > 0)
            return
        saveConfig(reports, reportFileNmae)
    }
    for (let ls of r.listeners) {
        const t = setTimeout(() => {
            let t0 = new Date().getTime()
            fetchDataThroughProxy(ls.port)  
                .then(data => {  
                    const t = new Date().getTime() - t0
                    console.log(ls.name, '    ', data.ip, '   ', data.country_code, '   ', t); // 打印获取到的数据数组
                    onFinish(ls.name, data.ip, data.country_code, t, false)
                })  
                .catch(error => {  
                    // console.error('An error occurred:', error);
                    console.log(ls.port, '    err')
                    onFinish(ls.name, '', '', 0, true)
                });
        }, running * 500)
        running++
    }
    setTimeout(() => {
        saveConfig(reports, 'proxy_test.yaml')
        setTimeout(() => process.exit(0), 1000)
    }, running * 500 + 20000)
})

