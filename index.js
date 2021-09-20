"use strict";
const http = require("http");
const fs = require("fs");
const qs = require("querystring");

//// index.htmlを読み込んだらサーバー起動
//// fs.readFile("./www/index.html", "UTF-8", (err, file) => {

//// if (err) {
////   console.error("ファイルの読み込みでエラーが発生しました\n" + err);
//// } else {
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(
      "[" +
        now +
        "] Requested by " +
        req.socket.remoteAddress +
        req.headers["user-agent"]
    );

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });
    //// res.write(file);
    switch (req.method) {
      case "GET":
        const rs = fs.createReadStream("./form.html");
        rs.pipe(res);
        break;
      case "POST":
        let rawData = "";
        req
          .on("data", (chunk) => {
            //// console.log("data");
            //// console.log(chunk);
            //// console.log("chunk" + chunk);
            rawData = rawData + chunk;
          })
          .on("end", () => {
            //// const decoded = decodeURIComponent(rawData);
            const answer = qs.parse(rawData);
            console.info(
              "[" +
                now +
                "] 投稿: " +
                " name = " +
                answer["name"] +
                " => " +
                answer["yaki-shabu"]
            );
            res.write(
              '<!DOCTYPE html><html lang="ja"><body><h1>' +
                answer["name"] +
                "さんは" +
                answer["yaki-shabu"] +
                "に投票しました</h1></body></html>"
            );
            res.end();
          });
        break;

      case "DELETE":
        res.write("DELETE" + req.url);
        res.end();
        break;
      default:
        break;
    }
  })
  .on("error", (e) => {
    console.error("[" + new Date() + "] Server Error", e);
  })
  .on("clientError", (e) => {
    console.error("[" + new Date() + "] Client Error", e);
  });

// listen
const port = 8000;
server.listen(port, () => {
  console.info("[" + new Date() + "] listening on..." + port);
});
