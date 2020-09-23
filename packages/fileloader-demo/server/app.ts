import http from 'http';
import { UploadController, MergeController, CheckChunkController } from './controllers';
import {logger} from './utils/logger'

const server = http.createServer();

server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }

  if(req.url === '/'){
    logger.info("route:%s", req.url)
    return res.end("Hello UploadLoader");
  }

  if (req.url === "/verify") {
    logger.info("route:%s", req.url)
    await CheckChunkController(req, res);
    return;
  }

  if (req.url === "/merge") {
    logger.info("route:%s", req.url)
    await MergeController(req, res);
    return;
  }

  if (req.url === "/upload") {
    await UploadController(req, res);
  }
});

export = server;