import Koa from 'koa';
// import serverless from 'serverless-http';
import {
    createConnection
} from 'typeorm';
import path from 'path';

import './utils/module-alias';

// import {dbConfig} from './config/index';
// console.log({dbConfig});

import {middlewares} from './middlewares';

const modelPath = path.join(__dirname, './models');

// middlewares

const app = new Koa();

app.use(middlewares);

createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'serverless_demo',
    charset: 'utf8mb4',
    entities: [
        `${modelPath}/**/*.ts`,
        `${modelPath}/**/*.js`
    ]
}).then((res)=>{
    // console.log(res);
}).catch(err=>{
    // console.error(err);
})

app.listen(3000, ()=>{
    console.log('server in on 3000')
})

// const handler = serverless(app);

// module.exports={
//     async main_handler(event, context, callback){
//         return await handler(
//             { ...event, queryStringParameters: event.queryString },
//             context
//           );        
//     }
// }