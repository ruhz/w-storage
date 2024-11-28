/*
https://ipv4.geojs.io/v1/ip/country.json
*/

import axios from 'axios'

export namespace net {
  export function wgetProxy(prot: number): Promise<IProxyInfo> {
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
    const result = new Promise<IProxyInfo>((resolve, rejects) => {
      axios.get<IProxyInfo>('http://api.ip.sb/geoip', proxyConfig)
        .then((r: { data: IProxyInfo | PromiseLike<IProxyInfo> }) => resolve(r.data))
        .catch((r: any) => rejects(r))
    })
    return result
  }

  export function wget<T>(url: string): Promise<T> {
    const proxyConfig = {
      proxy: {
        protocol: "http",
        host: '127.0.0.1', // 代理服务器的主机名或IP地址  
        port: 7890, // 代理服务器的端口号  
        // 如果你需要认证，可以设置以下属性：  
        // auth: {  
        //   username: 'your-username',  
        //   password: 'your-password'  
        // }  
      }
    }
    const result = new Promise<T>((resolve, rejects) => {
      axios.get<T>(url, proxyConfig)
        .then((r: { data: T | PromiseLike<T> }) => resolve(r.data))
        .catch((r: any) => rejects(r))
    })
    return result
  }

  interface IProxyInfo {
    // 根据你的 API 响应结构定义接口字段  
    country_code: string,
    ip: string
    // ... 其他字段  
  }
}