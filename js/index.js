const { ipcRenderer } = require('electron');

// Frame DOM
let closeIcon = document.getElementById('close-icon'),
    menuList = document.getElementById('menu-list'),
    content = document.getElementById('content');

// Content inner DOM
let addNote = document.getElementById('add-note'),
    history = document.getElementById('history'),
    about = document.getElementById('about');

// function DOM
let noteContent = document.getElementById('note-content');

// 关闭窗口
const quitApp = () => {
  ipcRenderer.send('exit');
};
// 切换content内容
const changeContent = (ev) => {
  addNote.className = "hide";
  history.className = "hide";
  about.className = "hide";

  switch(ev.target.innerHTML.toLowerCase()) {
    case 'new note':
      addNote.className = "";
      break;
    case 'history':
      history.className = "";
      break;
    case 'about':
      about.className = "";
      break;
  }
};
// paste note
const paste = () => {
  let content = noteContent.innerHTML;
  ipcRenderer.send('paste', {
    content: content
  });
};

closeIcon.addEventListener('click', quitApp);
menuList.addEventListener('click', changeContent);