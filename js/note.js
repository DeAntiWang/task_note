let { ipcRenderer } = require('electron');

const getQueryString = function(name) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i=0;i<vars.length;i++) {
    let pair = vars[i].split("=");
    if(pair[0] === name) { return pair[1]; }
  }
  return undefined;
};
// GET param
let content = getQueryString('content'),
    id = getQueryString('id');

// DOM
let container = document.getElementById('container'),
    button = document.getElementById('complete-btn');

container.innerHTML = content;

button.addEventListener('click', () => {
  ipcRenderer.send("checkComplete", {id: id})
});