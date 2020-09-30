import {EventEmitter} from 'events'
import path from 'path'
import process from 'process'
import osenv, { home } from 'osenv'
import chalk from "chalk"
import fs from 'fs-extra'
import { Command } from 'commander'
import { logger } from 'utils/logger'
import { Install } from 'utils/install'

const work_dir = process.cwd()
const home_dir = osenv.home()
const plugin_dir = path.join(home_dir, 'node_modules')

export
class CLI {
    ctx: CustomTS
    cmd: CustomTS
    home_dir: pathName
    plugin_dir: pathName
    logger: CustomTS
    install: CustomTS
    base_dir: pathName

    constructor() {
        this.home_dir = home_dir
        this.plugin_dir = plugin_dir
        this.cmd = new Command()
        
        // alias
        this.base_dir = home_dir
    }

    init(){
        // 注入到ctx中
        require('./generator')(this)
        require('./builder')(this)
        require('./utils/install')(this)
        require('./utils/logger')(this)
    }

    checkUpdate(){

    }

    loadPlugins(){
        // fs.readFileSync()
    }
}

// start
new CLI().init()