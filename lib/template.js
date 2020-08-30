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
      list += `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
      i++;
    }
    list += "</ul>";
    return list;
  },
  homeControl: function () {
    return `<a href = "/topic/create">create</a>`
  },

  topicControl: function (title) {
    return `<a href = "/topic/create">create</a>
        <a href="/topic/update/${title}">update</a>
        <form action="/topic/delete_process" method = "post">
          <input type = "hidden" name = "id" value="${title}">
          <input type = "submit" value="delete">
        </form>
        `
  },

  createControl: function () {
    return ``
  },

  updateControl: function (title) {
    return `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
  },

  topicBody: function (title, description) {
    return `<h2>${title}</h2>${description}`
  },

  createBody: function () {
    return `
    <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `
  },
  updateBody: function (title, description) {
    return `
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
    `

  }
};


