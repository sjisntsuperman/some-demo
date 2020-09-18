import http from 'http';
import { UploadController, MergeController, CheckChunkController } from './controllers';

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
    return res.end("Hello UploadLoader");
  }

  if (req.url === "/verify") {
    await CheckChunkController(req, res);
    return;
  }

  if (req.url === "/merge") {
    await MergeController(req, res);
    return;
  }

  if (req.url === "/upload") {
    await UploadController(req, res);
  }
});

export = server;