/* eslint-disable */
<template>
  <div class="upload">
    <input class="upload" type="file" @change="onFileChange" value="click me!" />
    <button @click="upload">
      upload here
    </button>
    <span>
      {{ Math.floor(hashPercentage) }}
    </span>
    <div class="status">
      status: {{ status }}
    </div>
    <div class="msg">
      msg: {{msg}}
    </div>
    <button @click="pause">
      pause here
    </button>
    <button @click="resume">
      resume here
    </button>
    <div v-for="file in data" :key="file.hash">
      <span>
        {{ file.hash }}
      </span>
      <span>
        {{ file.progress }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {asyncPool, fetch, prefix} from '../fetch/index'

interface CustomTS {
  [propName: string]: any | null
}

const SIZE = 10 * 1024 * 1024
const STATUS = {
  PAUSED: 'paused',
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
}

@Component
export default class Upload extends Vue {
  /** props  */
  @Prop() private name!: string

  /** state  */
  container: CustomTS = {}
  chunksize = 1000
  hashPercentage = 0
  data: Array<object> = []
  uploadedList: Array<number> = []
  requestList: Array<XMLHttpRequest> = []
  status: string = STATUS.PAUSED
  msg = 'here is msg'

  /**methods */
  onFileChange = (e: any) => {
    // 当临时替换文件时
    // this.reset()
    const [file] = e.target.files
    this.container.file = file
    // console.log(this.container)
  }

  pause() {
    this.status = STATUS.PAUSED
    this.msg = 'you have been pause the uploads'
    this.reset()
  }

  reset() {
    // 拒绝剩下的请求
    if (this.requestList.length) {
      this.requestList.forEach((xhr: XMLHttpRequest) => xhr.abort())
    }
    // 置空
    this.requestList = []
    this.container = {}
    this.data = []
    this.uploadedList = []
  }

  // 恢复上传
  resume(){
    this.upload()
  }

  async checkChunks() {
    const params: CustomTS = {
      filehash: this.container.hash,
      filename: this.container.file.name,
      hash: this.container.hash,
    }
    const data = await fetch({
      url: prefix + 'check',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify(params),
    })
    console.log(data)
    debugger
    const {
      uploadedList = []
    } = JSON.parse(data?.data)
    this.uploadedList = [...uploadedList]
  }

  createChunks(file:Blob) {
    const chunks = []
    let cur = 0
    while (cur < file.size) {
      chunks.push({file: file.slice(cur, cur + SIZE)})
      cur += SIZE
    }
    return chunks
  }

  async upload() {
    console.log(this.container)
    if (!this.container.file) return
    const chunks = await this.createChunks(this.container.file)
    this.container.hash = await this.creatHash(chunks)

    // 先检查有没已上传的文件列表
    await this.checkChunks()

    this.data = chunks.map(({file}, index) => ({
      filename: this.container.file.name,
      fileHash: this.container.hash,
      index,
      hash: this.container.hash + '-' + index,
      chunk: file,
      size: file.size,
      percentage: this.uploadedList.includes(index) ? 100 : 0,
    }))
    this.uploadChunks()
  }

  async uploadChunks() {
    // 避免重新传已有的文件
    const requestList: CustomTS = this.data
      .filter((flieInfo: CustomTS) => !this.uploadedList.includes(flieInfo.hash))
      .map((fileInfo: CustomTS) => {
        const {index} = fileInfo
        const form: FormData = this.createFormData(fileInfo, 'chunk', 'hash', 'fileHash', 'filename')
        return {
          url: prefix + 'upload',
          data: form,
          onProgress: this.progressHandler(this.data[index]),
          requestList: this.requestList,
        }
      })
    this.status = STATUS.PENDING
    this.msg = 'file is been uploading'
    //请求并发限制
    await asyncPool(4, requestList, fetch)
    this.mergeChunk().then(() => {
      this.status = STATUS.FULFILLED
      this.msg = 'file has been uploaded'
    })
  }

  progressHandler(fileInfo: CustomTS) {
    return (e: ProgressEvent) => {
      fileInfo.progress = Math.floor(e.loaded / e.total) / 100
    }
  }

  createFormData(info: CustomTS, ...keys: Array<string>) {
    const form: FormData = new FormData()
    Object.keys(info).forEach(key => {
      if (keys.includes(key)) {
        form.set(key, info[key])
      }
    })
    return form
  }

  creatHash(chunks: Array<object>) {
    return new Promise(resolve => {
      this.container.worker = new Worker('/hash.js')
      this.container.worker.postMessage({chunks})
      this.container.worker.onmessage = (e: any) => {
        const {percentage, hash} = e.data
        this.hashPercentage = percentage
        if (hash) {
          resolve(hash)
        }
      }
    })
  }

  spliceChunk(chunk: ArrayBuffer, idx: number) {
    return chunk.slice(idx, idx * this.chunksize)
  }

  mergeChunk() {
    return fetch({
      url: 'http://localhost:4000/merge',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        filename: this.container.file.name,
        size: SIZE,
        fileHash: this.container.hash,
      }),
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.msg{
  color: greenyellow;
}
.status{
  color: aqua;
}
</style>
