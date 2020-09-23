import fs, { PathLike } from 'fs';
import path from 'path';
import http from 'http';
import { logger } from './logger';

export const UPLOAD_DIR = path.join(__dirname, '../uploads');

export const pipeStream = async (
    pathname: PathLike,
    writestream: any
)=>{
    return new Promise((resolve)=>{
        const readstream=fs.createReadStream(pathname)
        readstream.on('end', ()=>{
            fs.unlinkSync(pathname)
            resolve()
        });
        readstream.pipe(writestream);
    })
}

export const isExistDir =async (pathname:string)=>{
    const fileInfo=await fs.statSync(pathname);
    const isDirectory=fileInfo.isDirectory();
    return isDirectory
};

export const writeFile = async(pathname:string, content:string)=>{
    return fs.writeFileSync(pathname, content);
}

export const extractExt = (pathname:string) =>{
    const point = pathname.indexOf('.');
    const ext = pathname.substr(point+1);

    return ext;
}

export const bodyParser = (req:http.IncomingMessage):any=>
    new Promise(resolve=>{
        let body = '';
        req.on('data', res=>{
            logger.info(res)
            body+=res;
        });

        req.on("end", () => {
            resolve(JSON.parse(body));
        });

    })