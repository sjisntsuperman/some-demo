import path from 'path';

const modelPath = path.join(__dirname, '../models');

export const dbConfig={
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'serverless_demo',
    charset: 'utf8mb4',
    entities: [
        `${modelPath}/*.ts`
    ]
}