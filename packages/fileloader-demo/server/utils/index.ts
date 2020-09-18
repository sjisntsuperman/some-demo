import fs from 'fs';
import path from 'path';
import http from 'http';

export const UPLOAD_DIR = path.join(__dirname, '../uploads');

export const resolve =  (pathname:string)=>{
    return path.join(__dirname, '../', pathname);
}

export const pipeStream = async (
    pathname: string,
    writestream: any
)=>{
    return new Promise((resolve)=>{
        const readstream=fs.createReadStream(pathname);
        readstream.on('end', ()=>{
            fs.unlinkSync(pathname);
            resolve();
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
    // const extReg=/\w(?=\.)(\w)/;
    // const ext = extReg.exec(pathname);
    // return RegExp.$1;
    const point = pathname.indexOf('.');
    const ext = pathname.substr(point+1);

    return ext;
}

export const bodyParser = (req:http.IncomingMessage)=>{
        let body = '';
        req.on('data', res=>{
            body+=res;
        });
        try{
            return JSON.parse(body);
        }catch(e){
            return body;
        }
}