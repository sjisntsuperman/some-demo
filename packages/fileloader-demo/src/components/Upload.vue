/* eslint-disable */
<template>
  <div class="upload">
    <input class="upload" type="file" @change="onFileChange" value="click me!" />
    <button @click="upload">
      upload here
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
import {asyncPool, fetch} from '../fetch/index'

interface CustomTS {
  [propName: string]: any
}

const SIZE = 10 * 1024 * 1024
// const STATUS = {
//   PAUSE: Symbol('pause'),
//   UPLOAD: Symbol('uploading'),
//   FULFILLED: Symbol('fulfilled'),
// }

@Component
export default class HelloWorld extends Vue {
  /** props  */
  @Prop() private msg!: string

  /** state  */
  container: CustomTS = {}
  chunksize = 1000
  hashPercentage = 0
  data: Array<object> = []
  uploadedList: Array<number> = []
  requestList: Array<Promise<any>> = []

  /**methods */
  onFileChange = (e: any) => {
    const [file] = e.target.files
    this.container.file = file
  }

  createChunks(file: File) {
    const chunks = []
    let cur = 0
    while (cur < file.size) {
      chunks.push({file: file.slice(cur, cur + SIZE)})
      cur += SIZE
    }
    return chunks
  }

  async upload() {
    if (!this.container.file) return
    const chunks = await this.createChunks(this.container.file)
    this.container.hash = this.creatHash(chunks)
    
    this.data = chunks.map(({file}, index) => ({
      fileHash: this.container.hash,
      index,
      hash: this.container.hash + '-' + index,
      chunk: file,
      size: file.size,
      percentage: this.uploadedList.includes(index) ? 100 : 0,
    }))
    this.uploadChunks()
  }

  uploadChunks = () => {
    this.requestList = this.data.map((fileInfo: CustomTS) => {
      const {index} = fileInfo
      const form = this.createFormData(fileInfo, 'chunk', 'size', 'hash', 'index', 'fileHash')
      return fetch({
        url: 'localhost:4000/upload',
        data: form,
        onProgress: this.progressHandler(this.data[index]),
      })
    })
    //
    asyncPool(4, this.requestList)
  }

  progressHandler = (fileInfo: CustomTS) => {
    return (e: ProgressEvent) => {
      fileInfo.progress = Math.floor(e.loaded / e.total) / 100
    }
  }

  createFormData = (info: CustomTS, ...keys: Array<string>) => {
    const form = new FormData()
    Object.keys(info).forEach(key => {
      if (keys.some(it => it == key)) {
        form.set(key, info[key])
      }
    })
    return form
  }

  creatHash = (chunks: Array<object>) => {
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
</style>
