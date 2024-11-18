import * as fs from 'fs'

export module Io {
  export function saveJSON(data: any, fileName: string) {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8')
  }

  export function loadCfg<T>(fileName: string): Promise<T> {
    const result = new Promise<T>((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
          console.error('读取文件时出错：', err);
          reject(err)
          return
        }
        try {
          resolve(JSON.parse(data) as T)
        } catch {
          reject('json err')
        }
        
      });
    })
    return result
  }
}