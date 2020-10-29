const PENDING = new Symbol('PENDING')
const FULFILLED = new Symbol('FULFILLED')
const REJECTED = new Symbol('REJECTED')

class _promise {
    constructor(executor) {
        this.queue = []
        this.val = undefined

        this.status = PENDING
        const resolve = (val) => {
            const  run = () => {
                if(this.status != PENDING) {
                    return
                }
                this.status = FULFILLED
                this.val = val
                while(this.queue.length) {
                    const cb = this.queue.shift()
                    cb(val)
                }
            }
            setTimeout(() => {
                run()
            }, 0);
        }
        const reject = () => {

        }
        setTimeout(() => {
            executor(resolve, reject)
        }, 0);
    }

    then(resolveFn, rejectFn) {
        return new _promise((resolve, reject)=>{
            const onfulfilled = (cb) => {
                try {
                    cb()
                } catch (err) {
                    throw(err)
                }
            }
            switch (this.status) {
                case PENDING:
                    this.queue.push(resolveFn)
                    break;
                case FULFILLED:
                    onfulfilled(resolveFn)
            }
        })
    }

    finally(cb) {
        const P = this.constructor
        return this.then(
            value => P.resolve(cb).then(()=>value)
        )
    }
}