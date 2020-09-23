/* eslint-disable */
import fs from 'fs-extra';
import path from 'path';
import http from 'http';
import multiparty from 'multiparty';

import { isExistDir, pipeStream,UPLOAD_DIR, extractExt, bodyParser } from '../utils';
import { logger } from '../utils/logger';

type Response = http.ServerResponse;
type Request = http.IncomingMessage;
interface Controller {
    (arg0:Request, arg1:Response): any
};

export const UploadController:Controller = async (req, res)=>{
        const multipart = new multiparty.Form({});
    
        multipart.parse(req, async (err, fields, files) => {
          if (err) {
            logger.error(err);
            res.statusCode = 500;
            res.end("process file chunk failed");
            return;
          }
          // logger.info(JSON.stringify(fields))
          const [chunk] = files.chunk;
          const [hash] = fields.hash;
          const [fileHash] = fields.fileHash;
          const [filename] = fields.filename;
          const filePath = path.resolve(
            UPLOAD_DIR,
            `${fileHash}${extractExt(filename)}`
          );
          const chunkDir = path.resolve(UPLOAD_DIR, fileHash);
    
          // 文件存在直接返回
          if (fs.existsSync(filePath)) {
            res.end("file exist");
            return;
          }
    
          // 切片目录不存在，创建切片目录
          if (!fs.existsSync(chunkDir)) {
            await fs.mkdirSync(chunkDir);
          }
          // fs-extra 专用方法，类似 fs.rename 并且跨平台
          // fs-extra 的 rename 方法 windows 平台会有权限问题
          // https://github.com/meteor/meteor/issues/7852#issuecomment-255767835
          await fs.move(chunk.path, path.resolve(chunkDir, hash));
          res.end("received file chunk");
        });
}

export const MergeController:Controller = async  (req, res)=>{
    const promisedata:any =await bodyParser(req);
    const {
      size,
      filename,
      fileHash
  } = promisedata
    const chunkDir = path.join(UPLOAD_DIR, `${fileHash}`);
    const files = fs.readdirSync(chunkDir);
    const ext = extractExt(filename)
    // output dir
    const pathname = path.join(UPLOAD_DIR, `${fileHash}${ext}`);
    // 避免顺序混乱
    files.sort((prev,cur)=>(Number(prev.split('-')[1])-Number(cur.split('-')[1])));
    await Promise.all(files.map((chunkpath:string, i:number)=>
      pipeStream(
          path.join(chunkDir, chunkpath),
          fs.createWriteStream(pathname, {
              start: size*i
          })
      )
    ))
    fs.rmdirSync(chunkDir);
    res.end(JSON.stringify({
      retcode: 0,
      message: 'merge success'
  }));
}

export const CheckChunkController:Controller = async (req, res) =>{
  const {filename} = bodyParser(req);
    const exist = await isExistDir(UPLOAD_DIR);
    if(!exist){
        fs.mkdirSync(UPLOAD_DIR);
    }
    const files = await fs.readdirSync(UPLOAD_DIR);
    const uploaded = files.map(file=>file===filename);
    res.end({
      uploaded: uploaded
    });
}

// export const 