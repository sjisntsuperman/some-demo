interface CustomT {
  [propName: string]: any
}

type requestOptions = {
  url?: string
  method?: string
  data?: object
  headers?: CustomT
  onProgress?: Function
  requestList?: any[]
}

export const fetch = ({
  url,
  method = 'post',
  data,
  headers = {},
  onProgress = (e: CustomEvent) => e,
  requestList,
}: requestOptions) => {
  return new Promise(resolve => {
    const xhr: any = new XMLHttpRequest()
    xhr.upload.onprogress = onProgress
    xhr.open(method, url)
    Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]))
    xhr.send(data)
    xhr.onload = (e: any) => {
      // 将请求成功的 xhr 从列表中删除
      if (requestList) {
        const xhrIndex = requestList.findIndex(item => item === xhr)
        requestList.splice(xhrIndex, 1)
      }
      resolve({
        data: e?.target?.response,
      })
    }
    // 暴露当前 xhr 给外部
    requestList?.push(xhr)
  })
}

/**
 * @name 并发请求限制
 * @param maxLimit
 * @param requestList
 */

export const asyncPool: Function = async (maxLimit: number, requestList: Promise<void>[]) => {
  const executing: Promise<void>[] = []
  const res: Promise<void>[] = []
  let i = 0

  const equeue = (): Promise<any> => {
    if (i === requestList.length) {
      return Promise.resolve(res)
    }

    const request: Promise<void> = requestList[i++]
    res.push(request)
    const block: Promise<any> = request
      .then(() => {
        return executing.splice(executing.indexOf(request), 1)
      })
      .then(() => console.log(i))
    executing.push(block)

    let r = Promise.resolve()

    if (executing.length >= maxLimit) {
      r = Promise.race(executing)
    }

    return r.then(() => equeue())
  }

  return equeue().then(() => Promise.all(res))
}
