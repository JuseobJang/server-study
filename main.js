var http = require("http");
var fs = require("fs");
var url = require("url");
console.log(fs);

var app = http.createServer(function (request, response) {
  var _url = request.url;
  // console.log(_url);

  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      var description = "Hello, Node.js";
      // fs.readFile(`./data/${title}`,'utf-8',function(err,description){

      var title = "welcome";
      var description = "Hello, Node.js";
      var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <U l>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </U>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
        `;
      response.writeHead(200);
      response.end(template);

      // });
    } else {
      fs.readFile(`./data/${title}`, "utf-8", function (err, description) {
        var title = queryData.id;
        var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <U l>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </U>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
        `;
        response.writeHead(200);
        response.end(template);
      });
    }
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
