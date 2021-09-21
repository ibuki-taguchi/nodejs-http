//! sever
// ⬢ pure-plains-65145
// https://pure-plains-65145.herokuapp.com/ | https://git.heroku.com/pure-plains-65145.git

"use strict";
const http = require("http");
const pug = require("pug");
const fs = require("fs");
const qs = require("querystring");
const auth = require("http-auth");
const basic = auth.basic(
  {
    realm: "Enquetes Area.",
  },
  (username, password, callback) => {
    callback(username === "user" && password === "test");
  }
);

//// index.htmlを読み込んだらサーバー起動
//// fs.readFile("./www/index.html", "UTF-8", (err, file) => {

//// if (err) {
////   console.error("ファイルの読み込みでエラーが発生しました\n" + err);
//// } else {
const server = http
  .createServer(
    basic.check((req, res) => {
      console.info(
        "Requested by " +
          req.socket.remoteAddress +
          " " +
          req.url +
          " user-agent : " +
          req.headers["user-agent"]
      );
      if (req.url === "/logout") {
        res.writeHead(401, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        res.end("ログアウトしました");
        return;
      }
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });
      //// res.write(file);
      switch (req.method) {
        case "GET":
          if (req.url === "/") {
            res.write(
              '<!DOCTYPE html><html lang="ja"><body><a href="/logout">ログアウト</a>' +
                "<h1>アンケートフォーム</h1>" +
                '<a href="/enquetes">アンケート一覧</a>' +
                "</body></html>"
            );
          } else if (req.url === "/enquetes") {
            res.write(
              '<!DOCTYPE html><html lang="ja"><body><a href="/logout">ログアウト</a>' +
                "<h1>アンケート一覧</h1><ul>" +
                '<li><a href="/enquetes/yaki-shabu">焼き肉・しゃぶしゃぶ</a></li>' +
                '<li><a href="/enquetes/rice-bread">ごはん・パン</a></li>' +
                '<li><a href="/enquetes/sushi-pizza">寿司・ピザ</a></li>' +
                "</ul></body></html>"
            );
          } else if (req.url === "/enquetes/yaki-shabu") {
            res.write(
              pug.renderFile("./form.pug", {
                path: req.url,
                firstItem: "焼肉",
                secondItem: "しゃぶしゃぶ",
              })
            );
          } else if (req.url === "/enquetes/rice-bread") {
            res.write(
              pug.renderFile("./form.pug", {
                path: req.url,
                firstItem: "ごはん",
                secondItem: "パン",
              })
            );
          } else if (req.url === "/enquetes/sushi-pizza") {
            res.write(
              pug.renderFile("./form.pug", {
                path: req.url,
                firstItem: "すし",
                secondItem: "ぴざ",
              })
            );
          }
          res.end();
          //// const rs = fs.createReadStream("./form.html");
          //// rs.pipe(res);
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
                "投稿: " +
                  " name = " +
                  answer["name"] +
                  " => " +
                  answer["favorite"]
              );
              res.write(
                '<!DOCTYPE html><html lang="ja"><body><h1><a href="/logout">ログアウト</a>' +
                  answer["name"] +
                  "さんは" +
                  answer["favorite"] +
                  'に投票しました</h1><a href="/enquetes">アンケート一覧に戻る</a></body></html>'
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
  )
  .on("error", (e) => {
    console.error("[" + new Date() + "] Server Error", e);
  })
  .on("clientError", (e) => {
    console.error("[" + new Date() + "] Client Error", e);
  });

// listen
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info("[" + new Date() + "] listening on..." + port);
});
