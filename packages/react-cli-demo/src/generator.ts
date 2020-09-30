import path from "path";
import fs from 'fs-extra'
import yeoman from "yeoman-environment"
import inquirer from "inquirer";
import { logger } from "utils/logger";

const yeomanEnv = yeoman.createEnv()

export
class Generator{
	ctx: CustomTS

	constructor(ctx: CustomTS){
		this.ctx = ctx
	}

	init(){
		const self = this
		const ctx = this.ctx
		this.loadGeneratorList().then((generators)=>{
			const options = generators.map((item: CustomTS) => {
				return item.desc
			  });
			  if (generators.length) {
				inquirer.prompt([{
				  type: 'list',
				  name: 'desc',
				  message: '您想要创建哪种类型的工程?',
				  choices: options
				}]).then((answer) => {
				  let name;
	  
				  generators.map((item: CustomTS) => {
					if (item.desc === answer.desc) {
					  name = item.name;
					}
				  });
	  
				  name && self.run(name);
				});
			  } else {
				logger.info(
				  '检测到你还未安装任何模板，请先安装后再进行项目初始化，'
				);
			  }
		})
	}

	getLocal(){
		const home_dir = this.ctx
	}

	run(name: string){
		const ctx = this.ctx
		const plugin_dir = ctx.plugin_dir
		let pathname = path.join(plugin_dir, name, 'app/index.js')
		yeomanEnv.register(pathname, name)
		yeomanEnv.run(name, ctx, ()=>{})
	}

	async loadGeneratorList(){
		const ctx = this.ctx
		const base_dir = ctx.base_dir
		const pkg_dir = path.join(base_dir, 'package.json')
		const plugin_dir = ctx.plugin_dir

		const deps_arr: Promise<string[]> = fs.readFile(pkg_dir).then((content: any)=>{
			const json = JSON.parse(content);
        	const deps = json.dependencies || json.devDependencies || {};

	        return Object.keys(deps);
		});
		const res = (await deps_arr).filter(function (name) {
			// Find yeoman generator.
			if (!/^generator-|^@[^/]+\/generator-/.test(name)) return false;
	  
			// Make sure the generator exists
			const pathname = path.join(plugin_dir, name);
			return fs.existsSync(pathname);
		  }).map(function (name) {
			const pathname = path.join(plugin_dir, name);
			let packagePath = path.join(pathname, 'package.json');
	  
			// Read generator config.
			return fs.readFile(packagePath).then(function (content: any) {
			  const json = JSON.parse(content);
			  const desc = json.description;
	  
			  return {name, desc};
			});
		})
		return res
	}

	installTemplate(){}
}