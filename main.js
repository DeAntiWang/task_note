const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron');
const Store = require('electron-store');

const store = new Store();
let win = null,
    notesWin = [];
let notes = [];

/*
 * electron-store
 */

const update = arr => {
  store.set('notes', arr);
};
const push = content => {
  let len = notes.length;
  let data = {
    content: content,
    isComplete: false
  };
  if(len === 0) {
    store.set('notes', [data]);
  }else{
    notes.push(data);
    store.set('notes', notes);
  }
  return len+1;
};
const pull = () => {
  return store.get('notes', [])
};

/*
 子窗口
 */

const createNewNote = function(content, id) {
  let res = new BrowserWindow({
    width: 200,
    height: 180,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    }
  });

  res.setVibrancy('medium-light');
  res.loadURL(`file://${__dirname}/html/note.html?content=${content}&id=${id}`);
  res.setAlwaysOnTop(true);

  notesWin.push(res);
};

// 渲染留在electron-store里面的数据为子窗口
const renderOld = () => {
  // 只渲染未完成的
  let arr = notes.filter( v => !v.isComplete );
  for(let idx in arr) {
    createNewNote(arr[idx].content, idx);
  }
};


/*
 主窗口
 */

const createWindow = function() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    }
  });

  win.setVibrancy('medium-light');
  win.loadFile('./html/index.html');

  // 从electron-store获取所有note
  notes = pull();
  renderOld();

  // 开发者工具
  // win.webContents.openDevTools();
};

app.on('ready', () => setTimeout(createWindow, 300));
app.on('active', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    setTimeout(createWindow, 300);
  }
});
// 不存在窗口时退出程序
app.on('window-all-closed', () => {
  app.quit()
});
// macOS 主题切换
nativeTheme.on('updated', function theThemeHasChanged () {
  if(nativeTheme.shouldUseDarkColors) win.setVibrancy('ultra-dark');
  else win.setVibrancy('medium-light');
});

/*
 ipcMain
 */

ipcMain.on('exit', () => {
  win.close();
});
ipcMain.on('paste', (ev, data) => {
  console.log(data.content);
  let ret_id = push(data.content);
  createNewNote(data.content, ret_id);
});
ipcMain.on('checkComplete', (ev, data) => {
  // dialog 确认窗口
  // TODO have problem
  let id = data.id;
  notes[id].isComplete = true;
  update(notes);
  notesWin.close();
});
ipcMain.on('complete', (ev, data) => {
  notes[data.id].isComplete = true;
  update(notes);
  // 关闭对应窗口
  notesWin[data.id].close();
});