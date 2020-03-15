const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron');
const Store = require('electron-store');

const store = new Store();
let win = null,
    notes = [];

/*
 子窗口
 */

const createNewNote = function(content) {
  let res = new BrowserWindow({
    width: 300,
    height: 400,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    }
  });

  res.setVibrancy('medium-light');
  res.loadFile(`./html/note.html?content=${content}&id=${notes.length}`);

  notes.push(res);
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
ipcMain.on('paste', data => {
  createNewNote(data.content);
});
ipcMain.on