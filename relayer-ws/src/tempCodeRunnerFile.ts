import path from "path";
import { readFileSync } from "fs";
import { createServer } from "https";

const keyPath = path.join(__dirname, "../key.pem");
const certPath = path.join(__dirname, "../cert.pem");

console.log("Using key:", keyPath);
console.log("Using cert:", certPath);

const server = createServer({
  key: readFileSync(keyPath),
  cert: readFileSync(certPath),
});

server.listen(8081, () => {
  console.log("HTTPS server running on 8081");
});
