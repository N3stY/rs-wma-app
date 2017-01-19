const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const icon = 'H:/Cross-X-Cross/Cookie OS/app.ico'
const fs = require('fs');

let mainWindow

function createWindow (width, height) {
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    movable: false,
    resizable: false,
    frame: false  //--- No window border
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
app.on('ready', () => {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  createWindow(width, height)
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
