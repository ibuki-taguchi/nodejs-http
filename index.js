"use strict";
const http = require("http");
const fs = require("fs");

// index.htmlを読み込んだらサーバー起動
fs.readFile("./www/index.html", "UTF-8", (err, file) => {
  if (err) {
    console.log("ファイルの読み込みでエラーが発生しました\n" + err);
  } else {
    const server = http
      .createServer((req, res) => {
        console.info(
          "[" +
            new Date() +
            "] Requested by " +
            req.socket.remoteAddress +
            req.headers["user-agent"]
        );

        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
        });
        res.write(file);

        res.end();
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
  }
});
