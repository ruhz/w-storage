/*
https://github.com/kamidox/stock-analysis
'https://stock.finance.sina.com.cn/fundInfo/api/openapi.php/CaihuiFundInfoService.getNav?
symbol=100032&datefrom=2020-01-01&dateto=2020-06-17&page=1'
*/

import { type fmodel } from "./fmodel";

const apiUrl = 'https://stock.finance.sina.com.cn/fundInfo/api/openapi.php/CaihuiFundInfoService.getNav'

export namespace SnFinance {
  export async function navs(symbol: string, count: number = 1) {
    let pg = 1
    const fundMap = new Map()
    let privuse = 0
    do {
      const surl = `${apiUrl}?symbol=${symbol}&page=${pg}`
      const p = await (await fetch(surl)).json()
      privuse = fundMap.size
      for (let item of p.result.data.data) {
        if (!fundMap.has(item.fbrq)) {
          fundMap.set(item.fbrq, item);
        }
      }
      pg++
    } while (privuse < fundMap.size && fundMap.size < count)
    return Array.from(fundMap.values()).map(m => {
      return {
        date: new Date(m.fbrq),
        jjjz: parseFloat(m.jjjz),
        ljjz: parseFloat(m.ljjz)
      }
    })
  }

  export function fixISOString(date: Date) {
    // 将当前时间加上8小时
    date.setHours(date.getHours() + 8);
    return date.toISOString();
}
/*
  export function getDays(symbol: string): Promise<IFundDay[]> {
    return new Promise<IFundDay[]>((resolve, reject) => {
      let surl = `https://stock.finance.sina.com.cn/fundInfo/api/openapi.php/CaihuiFundInfoService.getNav?symbol=${symbol}`
      let rsp = http.get<string>(surl)
      rsp.then(d => {
        let rsl: IFundDay[] = []
        let p = JSON.parse(d)
        for (let item of p.result.data.data) {
          rsl.push({ date: item.fbrq, jjjz: parseFloat(item.jjjz) })
        }
        resolve(rsl)
      })
    })
  }

  export function getNav(symbol: string, end: string): Promise<IFundDay[]> {
    let surl = ''
    if (end != '') {
      const start = '2024-01-01'
      surl = `${apiUrl}?symbol=${symbol}&datefrom=${start}&dateto=${end}`
    } else
      surl = `${apiUrl}?symbol=${symbol}`
    return new Promise<IFundDay[]>((resolve, reject) => {
      let rsp = http.get<string>(surl)
      rsp.then(d => {
        let rsl: IFundDay[] = []
        let p = JSON.parse(d)
        for (let item of p.result.data.data) {
          rsl.push({ date: item.fbrq, jjjz: parseFloat(item.jjjz) })
        }
        resolve(rsl)
      })
    })
  }

  export interface IFundDay {
    date: string
    jjjz: number
  }
    */
}

