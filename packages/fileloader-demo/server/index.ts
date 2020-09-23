import server from "./app";
import { logger } from './utils/logger';

server.listen(4000, () => logger.info("正在监听 4000 端口"));