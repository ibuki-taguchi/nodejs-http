"use strict";
const http = require("http");
const fs = require("fs");

// index.htmlを読み込んだらサーバー起動
fs.readFile("./www/index.html", "UTF-8", (err, file) => {
  if (err) {
    console.log("ファイルの読み込みでエラーが発生しました\n" + err);
  } else {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });
      res.write(file);
      console.log("access from  " + req.headers["user-agent"]);
      res.end();
    });

    // listen
    const port = 8000;
    server.listen(port, () => {
      console.log("listening on..." + port);
    });
  }
});
