"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
class Config {
    static async getLocal() {
        const workDir = process_1.default.cwd();
        const configPath = path_1.default.join(workDir, 'cli-demo.json');
        const config = await fs_extra_1.default.readFileSync(configPath);
        const json = JSON.parse(JSON.stringify(config));
        return json;
    }
    static async getBuilderType() {
        const json = await Config.getLocal();
        const builderType = json.builderType;
        return builderType;
    }
}
exports.Config = Config;
