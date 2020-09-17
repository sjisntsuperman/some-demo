const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();

const fs = require('fs')
const path = require('path');

const DOWN_DIR= './downalds';

function pathJoin(dir){
    return path.join(__dirname, dir);
}

const proxy = /api/;

const app = new Koa();

router.post(`/api/merge`, async(ctx)=>{
    
})

router.post(`/api/upload`, async(ctx)=>{
    const files = fs.readdirSync(pathJoin(DOWN_DIR));
    files.forEach(file=>{
        
    })
})

app.use(routes.allowMethods()).use(router);

app.listen(3000, (ctx)=>{
    console.log('server is on 3000');
})

module.exports = app;