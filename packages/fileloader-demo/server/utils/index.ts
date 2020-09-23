import fs, { PathLike } from 'fs-extra';
import path from 'path';
import http from 'http';
import { logger } from './logger';

export const UPLOAD_DIR = path.join(__dirname, '../uploads');

export const pipeStream = async (pathname: PathLike, writestream: any) => {
	return new Promise((resolve) => {
		const readstream = fs.createReadStream(pathname);
		readstream.on('end', () => {
			fs.unlinkSync(pathname);
			resolve();
		});
		readstream.pipe(writestream);
	});
};

export const writeFile = async (pathname: string, content: string) => {
	return fs.writeFileSync(pathname, content);
};

export const extractExt = (pathname: string) => {
	const point = pathname.lastIndexOf('.');
	const ext = pathname.substr(point);

	return ext;
};

export const bodyParser = (req: http.IncomingMessage): any =>
	new Promise((resolve) => {
		let body = '';
		req.on('data', (res) => {
			logger.info(res);
			body += res;
		});

		req.on('end', () => {
			resolve(JSON.parse(body));
		});
	});

    // 检验是否已存在上传文件
export const verifyChunk = (filehash: string, filename: string):Boolean =>{
    const chunks:Array<string> = fs.readdirSync(UPLOAD_DIR)
    const ext = extractExt(filename)
    const chunkname = `${filehash}${ext}`
    if(chunks.includes(chunkname)){
        return true
    }
    return false
}