var express = require('express') //express module 
var app = express() // app 을 express 로 실행
var fs = require("fs"); // file system
var template = require('./lib/template.js'); // template module
var topicRouter = require('./routes/topic.js') // topic router module

//middle-ware
var bodyParser = require('body-parser'); // request.on() 을 간결하게 해줌
var compresstion = require('compression'); // request/response 간에 압축 형식으로 데이터 전송

const port = 3000 // port 번호 3000


app.use(express.static('public')); //이미지와 같은 정적인 파일을 불러 올떄 사용, /public 폴더를 우선으로 검색
app.use(bodyParser.urlencoded({ extended: false })); // body-parser middle ware
app.use(compresstion()); // compression middle-ware

app.get('*', function (request, response, next) { // 모든(*), url 경로 상관없이 ./data에서 파일 리스트를 뽑아 request.list 에 담아 어디서든 사용 가능, next() : 다음 middle-ware 실행
  fs.readdir("./data", (err, filelist) => { //read directory
    request.list = filelist;
    next();
  });
})


app.get('/', (request, response) => { //home-directory 
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

app.use('/topic', topicRouter); // /topic 에 관한 url 이 들어 올시 topicRouter 가 처리함

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