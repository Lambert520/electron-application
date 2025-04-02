/*
    app: 控制应用程序的事件生命周期
    BrowserWindow: 创建和管理 app 的窗口
*/
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('node:path');
const { updateElectronApp } = require('update-electron-app');
updateElectronApp({
    repo: 'Lambert520/electron-application',
    updateInterval: '5 minutes'
});


function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            // 将预加载脚本附在渲染进程上(path.join创建一个跨平台的路径字符串)
            preload: path.join(__dirname, 'preload.js')
        }
    });
    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => mainWindow.webContents.send('update-counter', 1),
                    label: 'Increment'
                },
                {
                    click: () => mainWindow.webContents.send('update-counter', -1),
                    label: 'Decrement'
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);
    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win.setTitle(title);
    });
    // 监听 ready-to-show 事件
    mainWindow.on('ready-to-show', () => {
        mainWindow.show(); // 内容加载完成后显示窗口
    });
    mainWindow.loadFile('index.html');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}
app.whenReady().then(() => {
    // 监听渲染进程向主进程通信（双向: 给渲染进程返回一个回复）
    ipcMain.handle('ping', () => 'pong');

    // 监听渲染进程向主进程通信（单向）
    ipcMain.on('counter-value', (_event, value) => {
        console.log(value);
    })

    createMainWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})