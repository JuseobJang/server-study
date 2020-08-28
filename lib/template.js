module.exports = {
  HTML: function (title, list, body, control) {
    // HTML 을 만들어주는 함수 리턴 값으로 html 스크립트를 출력함.
    // list : 글 목록
    // control : create, modify , delete가 필요에 의해 표시
    // body : 글의 내용å
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
  },
  list: function (filelist) { //파일리스트를 배열로 받아 html 형식의 ul 로 만들어 주는 함수
    var list = "<ul>";
    var i = 0;
    while (i < filelist.length) {
      list += `<li><a href="/page/${filelist[i]}">${filelist[i]}</a></li>`;
      i++;
    }
    list += "</ul>";
    return list;
  }
};


