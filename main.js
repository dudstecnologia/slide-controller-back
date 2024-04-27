const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const ks = require('node-key-sender')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 270,
    height: 260,
    maximizable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.setMenu(null)
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on('command', (event, arg) => {
    if (['f5', 'left', 'right'].includes(arg)) {
      ks.sendKey(arg);
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
