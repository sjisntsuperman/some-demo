import { asyncPool } from "./index";

const requestList:Array<number> = [];
const MAX=30;
const sleep=(time:number, executing: Array<Promise<void>>)=>{
    const random = Math.floor(Math.random()*3000);
    const len = executing.length;
    return new Promise(resolve=>{
        setTimeout(() => {
            console.log(random, time);
            resolve();
            const gap = len - executing.length
            expect(gap>1&&gap<4).toBe(true)
        }, random*time);
    })
}

for (let i:number = 0; i < MAX; i++) {
    requestList.push(i);
}

// TODO 补充异步测试 监听
describe('describe', () => {
    test('test1111', () => {
        // expect(
            asyncPool(1, requestList, sleep)
        // )
    });
});
