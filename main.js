var express = require('express')
var app = express()
var fs = require("fs"); // file system
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');



const port = 3000

app.get('/', (request, response) => {
  fs.readdir("./data", (err, filelist) => { //read directory
    if (err) {
      throw err;
    }
    var title = "Welcome";
    var description = "Hello, Node.js";
    var list = template.list(filelist); // directory 내의 파일을 list화
    var HTML = template.HTML(title, list, `<h2>${title}</h2>${description}`, `<a href = "/create">create</a>`); // html 생성
    response.send(HTML); // html response
  });
})

app.get('/page/:pageId', (request, response) => {
  fs.readdir("./data", (err, filelist) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, "utf-8", (err, description) => { //디렉토리 안의 id 와 이름이 같은 파일의 내용을 description으로 넣음
      if (err) {
        throw err;
      }
      var title = request.params.pageId;

      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description);

      var list = template.list(filelist);
      var HTML = template.HTML(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `<a href = "/create">create</a>
      <a href="/update/${sanitizedTitle}">update</a>
      <form action="delete_process" method = "post">
        <input type = "hidden" name = "id" value="${sanitizedTitle}">
        <input type = "submit" value="delete">
      </form>
      `); //descrption 을 내용으로 추가하고 control 인자에 update와 delete가 추가
      response.send(HTML);
    });
  });
})

app.get('/create', (request, response) => {
  fs.readdir("./data", (err, filelist) => {
    if (err) {
      throw err;
    }
    var title = "WEB - create";
    var list = template.list(filelist);
    var HTML = template.HTML(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, ``); //form 형식으로 /create_process 로 보냄
    response.send(HTML);
  });
})

app.post('/create_process', (request, response) => {
  var body = ``;
  request.on('data', (data) => {
    body += data;
  })
  request.on('end', () => {
    var post = qs.parse(body); //data 내용 을 qs 로 parsing
    var title = post.title; // 제목 저장
    var description = post.description; // 내용 저장
    fs.writeFile(`data/${title}`, description, 'utf-8', (err) => { // 제목을 파일 명으로 하여 파일 생성
      if (err) throw err;
      response.writeHead(302, { Location: `/?id=${title}` }); // 302 redirection
      response.end();

    })
  })

})

app.get('/update/:pageId', (request, response) => {
  fs.readdir('./data', (err, filelist) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      var title = request.params.pageId;
      var list = template.list(filelist);
      var HTML = template.HTML(title, list,
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
      response.send(HTML);
    });
  });
})
app.post('/update_process', (request, response) => {
  var body = ``;
  request.on('data', (data) => {
    body += data;
  })
  request.on('end', () => {
    var post = qs.parse(body);
    var id = post.id
    var title = post.title;
    var description = post.description;

    fs.rename(`data/${id}`, `data/${title}`, (err,) => { // 이름 변경
      fs.writeFile(`data/${title}`, description, 'utf-8', (err) => { // 파일 쓰기
        if (err) throw err;
        response.writeHead(302, { Location: `/page/${title}` }); // 302 redirection
        response.end();

      });
    });
  });

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/*var http = require("http"); // protocol http
var fs = require("fs"); // file system
var url = require("url");
var qs = require('querystring');

var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function (request, response) { // Create Server using request & response
  var _url = request.url; // 요청된 request url 을 저장
  var queryData = url.parse(_url, true).query; //url을 parsing 해서 queryString 저장
  var pathname = url.parse(_url, true).pathname; //url을 parsing 해서 pathname 저장

  if (pathname === "/") { // root directory
    if (queryData.id === undefined) { //id 미정의
      fs.readdir("./data", (err, filelist) => { //read directory
        if (err) {
          throw err;
        }
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = template.list(filelist); // directory 내의 파일을 list화
        var HTML = template.HTML(title, list, `<h2>${title}</h2>${description}`, `<a href = "/create">create</a>`); // html 생성
        response.writeHead(200); //head 생성
        response.end(HTML); // html response
      });
    } else { // id 가 정의 되어 있는 경우
      fs.readdir("./data", (err, filelist) => {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`./data/${filteredId}`, "utf-8", (err, description) => { //디렉토리 안의 id 와 이름이 같은 파일의 내용을 description으로 넣음
          if (err) {
            throw err;
          }
          var title = queryData.id;

          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description);

          var list = template.list(filelist);
          var HTML = template.HTML(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `<a href = "/create">create</a>
          <a href="/update?id=${sanitizedTitle}">update</a>
          <form action="delete_process" method = "post">
            <input type = "hidden" name = "id" value="${sanitizedTitle}">
            <input type = "submit" value="delete">
          </form>
          `); //descrption 을 내용으로 추가하고 control 인자에 update와 delete가 추가
          response.writeHead(200);
          response.end(HTML);
        });
      });
    }
  }
  else if (pathname === "/create") { // 파일 생성 HTM
    fs.readdir("./data", (err, filelist) => {
      if (err) {
        throw err;
      }
      var title = "WEB - create";
      var list = template.list(filelist);
      var HTML = template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, ``); //form 형식으로 /create_process 로 보냄
      response.writeHead(200);
      response.end(HTML);
    });
  }
  else if (pathname === "/create_process") {
    var body = ``;
    request.on('data', (data) => {
      body += data;
    })
    request.on('end', () => {
      var post = qs.parse(body); //data 내용 을 qs 로 parsing
      var title = post.title; // 제목 저장
      var description = post.description; // 내용 저장
      fs.writeFile(`data/${title}`, description, 'utf-8', (err) => { // 제목을 파일 명으로 하여 파일 생성
        if (err) throw err;
        response.writeHead(302, { Location: `/?id=${title}` }); // 302 redirection
        response.end();

      })
    })

  }
  else if (pathname === '/update') { // update HTML form 생성
    fs.readdir('./data', (err, filelist) => {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        var title = queryData.id;
        var list = template.list(filelist);
        var HTML = template.HTML(title, list,
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
        response.end(HTML);
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

      fs.rename(`data/${id}`, `data/${title}`, (err,) => { // 이름 변경
        fs.writeFile(`data/${title}`, description, 'utf-8', (err) => { // 파일 쓰기
          if (err) throw err;
          response.writeHead(302, { Location: `/?id=${title}` }); // 302 redirection
          response.end();

        })
      })
    })
  }
  else if (pathname === '/delete_process') { //
    var body = ``;
    request.on('data', (data) => {
      body += data;
    })
    request.on('end', () => {
      var post = qs.parse(body);
      var id = post.id
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, (err) => {
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
app.listen(3000); */