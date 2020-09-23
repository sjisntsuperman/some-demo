interface CustomT {
  [propName: string]: any
}

type requestOptions = {
  url?: string
  method?: string
  data?: FormData|string
  headers?: CustomT
  onProgress?: {
    (this: XMLHttpRequest, ev: ProgressEvent) : any | null
  },
  requestList?: Array<XMLHttpRequest>
}

interface fetchMethod {
  (propName: requestOptions): Promise<any>
}

export const prefix = 'http://localhost:4000/'

export const fetch :fetchMethod= ({
  url='',
  method = 'post',
  data='',
  headers = {},
  onProgress = (e: ProgressEvent<EventTarget>) => e,
  requestList = []
}: requestOptions) => {
  return new Promise((resolve) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest()
    xhr.upload.onprogress = onProgress
    xhr.open(method, url)
    Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]))
    xhr.send(data)
    xhr.onload = (e: any) => {
      resolve({
        data: e?.target?.response,
      })
    }
    requestList.push(xhr)
  })
}

/**
 * @name 并发请求限制
 * @param maxLimit
 * @param requestList
 */

export const asyncPool: Function = (maxLimit: number, requestList: Array<object>, iteratorFn:Function) => {
  const executing: Promise<void>[] = []
  const res: Promise<void>[] = []
  let i = 0

  const equeue = (): Promise<any> => {
    if (i === requestList.length) {
      return Promise.resolve(res)
    }

    const requestOptions = requestList[i++]
    const request: Promise<any> = Promise.resolve().then(()=>iteratorFn(requestOptions));
    res.push(request)
    const block: Promise<any> = request
      .then(() => {
        return executing.splice(executing.indexOf(request), 1)
      })
    executing.push(block)

    let r = Promise.resolve()

    if (executing.length >= maxLimit) {
      r = Promise.race(executing)
    }

    return r.then(() => equeue())
  }

  return equeue().then(() => Promise.all(res))
}
