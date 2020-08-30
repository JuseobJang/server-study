var express = require('express')
var router = express.Router();

var fs = require("fs");
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');






router.get('/create', (request, response) => {
    var title = "WEB - create";
    var list = template.list(request.list);
    var HTML = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
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
})

router.post('/create_process', (request, response) => {

    var post = request.body; // using body-parser 
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
        if (err) throw err;
        response.redirect(`/topic/${title}`);
    })
})


router.post('/update_process', (request, response) => {

    var post = request.body;
    var id = post.id
    var title = post.title;
    var description = post.description;

    fs.rename(`data/${id}`, `data/${title}`, (err,) => { // 이름 변경
        fs.writeFile(`data/${title}`, description, 'utf-8', (err) => { // 파일 쓰기
            if (err) throw err;
            response.redirect(`/topic/${title}`)

        });
    });


})
router.get('/update/:pageId', (request, response) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        var title = request.params.pageId;
        var list = template.list(request.list);
        var HTML = template.HTML(title, list,
            `
        <form action="/topic/update_process" method="post">
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
            `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
        );
        response.send(HTML);
    });
})

router.post('/delete_process', (request, response) => {

    var post = request.body;
    var id = post.id
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, (err) => {
        response.redirect('/');
    })
})

router.get('/:pageId', (request, response, next) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, "utf-8", (err, description) => { //디렉토리 안의 id 와 이름이 같은 파일의 내용을 description으로 넣음
        if (err) {
            next(err);
        }
        var title = request.params.pageId;

        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description);

        var list = template.list(request.list);
        var HTML = template.HTML(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `<a href = "/topic/create">create</a>
        <a href="/topic/update/${sanitizedTitle}">update</a>
        <form action="/topic/delete_process" method = "post">
          <input type = "hidden" name = "id" value="${sanitizedTitle}">
          <input type = "submit" value="delete">
        </form>
        `); //descrption 을 내용으로 추가하고 control 인자에 update와 delete가 추가
        response.send(HTML);
    });
})

module.exports = router;