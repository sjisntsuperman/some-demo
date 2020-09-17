import fs from 'fs';
import path from 'path';

export
const getTemplate:Function=(html:string)=>{
    return fs.readFileSync(html, {
        encoding: 'utf-8'
    });
}

export
const getCssTemplate=()=>{
    return {
        githubcss: getTemplate(path.join(__dirname, './github-markdown.css')),
        homecss: getTemplate(path.join(__dirname, '../views/home/index.css')),
        postcss: getTemplate(path.join(__dirname, '../views/post/index.css'))
    };
}
