import fs from "fs-extra";
import path from "path";
import process from 'process';

export
class Config {

    static async getLocal() {
        const workDir = process.cwd()
        const configPath = path.join(workDir, 'cli-demo.json')
        const config = await fs.readFileSync(configPath)
        const json = JSON.parse(JSON.stringify(config))

        return json
    }

    static async getBuilderType() {

        const json = await Config.getLocal()

        const builderType = json.builderType

        return builderType
    }

}