import http from "http";
import fs from "fs";
import path from "path";

const server = http.createServer((req, res) => {
  const filePath = "." + (req.url === "/" ? "/index.html" : req.url);
  const ext = path.extname(filePath);

  const type = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css"
  }[ext] || "text/plain";

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000);
