var http = require("http"); // protocol http
var fs = require("fs"); // file system
var url = require("url");
var qs = require('querystring');

// HTML 을 만들어주는 함수 리턴 값으로 html 스크립트를 출력함.
// list : 글 목록
// control : create, modify , delete가 필요에 의해 표시
// body : 글의 내용
function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body} 
  </body>
  </html>
  `;
}

//파일리스트를 배열로 받아 html 형식의 ul 로 만들어 주는 함수
function templateList(filelist) {
  var list = "<ul>";
  var i = 0;
  while (i < filelist.length) {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list += "</ul>";
  return list;

}

var app = http.createServer(function (request, response) { // Create Server using request & response
  var _url = request.url; // 요청된 request를 _url에 저장
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (err, filelist) => {
        if (err) {
          throw err;
        }
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href = "/create">create</a>`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", (err, filelist) => {
        fs.readFile(`./data/${queryData.id}`, "utf-8", (err, description) => {
          if (err) {
            throw err;
          }
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href = "/create">create</a> 
          <a href="/update?id=${title}">update</a>
          <form action="delete_process" method = "post">
            <input type = "hidden" name = "id" value="${title}">
            <input type = "submit" value="delete">
          </form>
          `);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  }
  else if (pathname === "/create") {
    fs.readdir("./data", (err, filelist) => {
      if (err) {
        throw err;
      }
      var title = "WEB - create";
      var list = templateList(filelist);
      var template = templateHTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, ``);
      response.writeHead(200);
      response.end(template);
    });
  }
  else if (pathname === "/create_process") {
    var body = ``;
    request.on('data', (data) => {
      body += data;
    })
    request.on('end', () => {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
        if (err) throw err;
        response.writeHead(302, { Location: `/?id=${title}` }); // 302 redirection
        response.end();

      })
    })

  }
  else if (pathname === '/update') {
    fs.readdir('./data', (err, filelist) => {
      fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list,
          `
          <form action="/update_process" method="post">
            <input type ="hidden" name ="id" value ="${title}">
            <p><input type="text" name="title" placeholder="title" value ="${title}"></p>
            <p>
            <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  }
  else if (pathname === '/update_process') {
    var body = ``;
    request.on('data', (data) => {
      body += data;
    })
    request.on('end', () => {
      var post = qs.parse(body);
      var id = post.id
      var title = post.title;
      var description = post.description;

      fs.rename(`data/${id}`, `data/${title}`, (err,) => {
        fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
          if (err) throw err;
          response.writeHead(302, { Location: `/?id=${title}` }); // 302 redirection
          response.end();

        })
      })
    })
  }
  else if (pathname === '/delete_process') {
    var body = ``;
    request.on('data', (data) => {
      body += data;
    })
    request.on('end', () => {
      var post = qs.parse(body);
      var id = post.id
      fs.unlink(`data/${id}`, (err) => {
        response.writeHead(302, { Location: `/` })
        response.end();
      })
    })
  }
  else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
