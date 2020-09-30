
export
class Command{
	alias: CustomTS
	store: CustomTS

	constructor(){
		this.alias = {}
		this.store = {}
	}

	get(name:string){
		return this.alias[name]
	}

	list(){}

	register(name:string, value:any){
		return this.alias[name] = value
	}
}