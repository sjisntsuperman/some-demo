"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const yeoman_environment_1 = __importDefault(require("yeoman-environment"));
const inquirer_1 = __importDefault(require("inquirer"));
const yeomanEnv = yeoman_environment_1.default.createEnv();
class Generator {
    constructor(ctx) {
        this.ctx = ctx;
    }
    init() {
        const self = this;
        const ctx = this.ctx;
        const logger = ctx.logger;
        this.loadGeneratorList().then((generators) => {
            const options = generators.map((item) => {
                return item.desc;
            });
            if (generators.length) {
                inquirer_1.default.prompt([{
                        type: 'list',
                        name: 'desc',
                        message: '您想要创建哪种类型的工程?',
                        choices: options
                    }]).then((answer) => {
                    let name;
                    generators.map((item) => {
                        if (item.desc === answer.desc) {
                            name = item.name;
                        }
                    });
                    name && self.run(name);
                });
            }
            else {
                logger.info('检测到你还未安装任何模板，请先安装后再进行项目初始化，');
            }
        });
    }
    run(name) {
        const ctx = this.ctx;
        const pluginDir = ctx.pluginDir;
        let pathname = path_1.default.join(pluginDir, name, 'app/index.js');
        yeomanEnv.register(pathname, name);
        yeomanEnv.run(name, ctx, () => { });
    }
    async loadGeneratorList() {
        const ctx = this.ctx;
        const baseDir = ctx.baseDir;
        const pkg_dir = path_1.default.join(baseDir, 'package.json');
        const pluginDir = ctx.pluginDir;
        const deps_arr = fs_extra_1.default.readFile(pkg_dir).then((content) => {
            const json = JSON.parse(content);
            const deps = json.dependencies || json.devDependencies || {};
            return Object.keys(deps);
        });
        const res = (await deps_arr).filter(function (name) {
            // Find yeoman generator.
            // generator-ivweb
            if (!/^generator-|^@[^/]+\/generator-/.test(name))
                return false;
            // Make sure the generator exists
            const pathname = path_1.default.join(pluginDir, name);
            return fs_extra_1.default.existsSync(pathname);
        }).map(function (name) {
            const pathname = path_1.default.join(pluginDir, name);
            let packagePath = path_1.default.join(pathname, 'package.json');
            // Read generator config.
            return fs_extra_1.default.readFile(packagePath).then(function (content) {
                const json = JSON.parse(content);
                const desc = json.description;
                return { name, desc };
            });
        });
        return res;
    }
}
exports.Generator = Generator;
exports.default = (ctx) => {
    const cmd = ctx.cmd;
    cmd.register("init", () => new Generator(ctx).init());
};
