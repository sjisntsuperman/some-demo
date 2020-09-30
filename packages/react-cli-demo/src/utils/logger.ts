import chalk from "chalk";

export class logger{
    constructor(){}

    static info(msg: string){
        chalk.cyan(msg)
    }

    static warn(msg:string){
        chalk.red(msg)
    }
}