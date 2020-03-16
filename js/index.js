const { ipcRenderer } = require('electron');
const Store = require('electron-store');

const store = new Store();

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
      renderHistory();
      history.className = "";
      break;
    case 'about':
      about.className = "";
      break;
  }
};
// paste note
const paste = () => {
  let content = noteContent.value;
  noteContent.value = "";
  // console.log(noteContent, noteContent.innerHTML, noteContent.innerText);
  ipcRenderer.send('paste', {
    content: content
  });
};
// render history
const renderHistory = () => {
  let notes = store.get('notes', []);
  history.innerHTML = "";

  notes.forEach( val => {
    let res = document.createElement('div');
    res.className = "list-element";
    res.innerHTML = `<span class="${val.isComplete?'complete':'uncomplete'}">${val.isComplete?'已完成':'未完成'}</span> ${val.content}`;
    history.appendChild(res);
  });
};

closeIcon.addEventListener('click', quitApp);
menuList.addEventListener('click', changeContent);

// Main
renderHistory();