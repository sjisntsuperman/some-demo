import spawn from "cross-spawn";

export default (ctx: CustomTS, ...args: string[])=>{
    const cmd = ctx.cmd
    // cmd.register("install", )
    return new Install(ctx).execNpmCmd('install', ...args)
}

export
class Install{
    ctx: CustomTS

    constructor(ctx:CustomTS){
        this.ctx = ctx
        ctx.execNpmCmd = this.execNpmCmd
    }

    execNpmCmd(name:string, ...rest:string[]){
        let args: string[] = []
        args.concat(['install'])
        args.concat([...rest])
        const npm = spawn("yarn", args, {cwd: 'where'})
        npm.on("close", ()=>{
            this.ctx.logger.info('installed successfully')
        })
    }
}