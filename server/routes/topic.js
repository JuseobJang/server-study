var express = require('express')
var router = express.Router(); //app = express() 와는 다르게 express.Router() 로 실행

var fs = require("fs"); // file system
var path = require('path'); // path moudule ex) path.base()
var sanitizeHtml = require('sanitize-html'); // sanitizeHTML module 위험 태그를 걸러주고, 원하는 태그 취사 선택 가능
var template = require('../lib/template.js'); // template module








// 실제 url 은 앞에 /topic을 포함한다고 할 수 있음
router.get('/create', (request, response) => { // 
    // tmplate.HTML() 의 인수로 필요한 title, list, body , control 정의!
    var title = "WEB - create";
    var list = template.list(request.list);
    var body = template.createBody();
    var control = template.createControl();
    // HTML template 생성
    var HTML = template.HTML(title, list, body, control); //form 형식으로 /create_process 로 보냄

    response.send(HTML);
})

router.post('/create_process', (request, response) => {

    var post = request.body // body-parser middle 를 사용하였기 떄문에 request.on 불필요 reqeust.body = { title : ~~~ ,description : ~~~}
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
        if (err) throw err;
        response.redirect(`/topic/${title}`); // redirect
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
        var body = template.updateBody(title, description);
        var control = template.updateControl(title);

        var HTML = template.HTML(title, list, body, control);
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
        var body = template.topicBody(sanitizedTitle, sanitizedDescription);
        var control = template.topicControl(sanitizedTitle);

        var HTML = template.HTML(sanitizedTitle, list, body, control); //descrption 을 내용으로 추가하고 control 인자에 update와 delete가 추가
        response.send(HTML);
    });
})

module.exports = router;