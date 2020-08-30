var express = require('express')
var app = express()
var fs = require("fs"); // file system
var template = require('./lib/template.js');
var topicRouter = require('./routes/topic.js')

//middle-ware
var bodyParser = require('body-parser');
var compresstion = require('compression');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compresstion());

app.get('*', function (request, response, next) {
  fs.readdir("./data", (err, filelist) => { //read directory
    request.list = filelist;
    next();
  });
})

const port = 3000

app.get('/', (request, response) => {
  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(request.list); // directory 내의 파일을 list화
  var HTML = template.HTML(title, list,
    `
  <h2>${title}</h2>${description}
  <img src="/image/hello.jpg" style="width : 300px; display : block; margin-top : 10px ">
  `,
    `<a href = "/topic/create">create</a>`); // html 생성
  response.send(HTML); // html response
})

app.use('/topic', topicRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!"); // 404 error 처리
})

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!"); // 500 error 처리
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})