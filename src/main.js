/*
    app: 控制应用程序的事件生命周期
    BrowserWindow: 创建和管理 app 的窗口
*/
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('node:path');
const { updateElectronApp } = require('update-electron-app');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

// 5分钟后触发更新
updateElectronApp({
    repo: 'Lambert520/electron-application',
    updateInterval: '5 minutes',
    logger: log, // 添加日志记录
    notifyUser: true, // 显示更新提示
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
            role: 'fileMenu',    // 文件菜单 (Windows/Linux)
            label: '文件',        // 可自定义中文标签
            submenu: [
                {
                    role: 'close' // 保留关闭项
                }
            ]
        },
        {
            role: 'editMenu' // 编辑菜单
        },
        {
            role: 'viewMenu' // 视图菜单
        },
        {
            role: 'windowMenu' // 窗口菜单
        },
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

    // app标题设置
    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win.setTitle(title);
    });

    // 监听渲染进程向主进程通信（单向）
    ipcMain.on('counter-value', (_event, value) => {
        console.log(value);
    });

    createMainWindow();

    // 主动触发更新（开发环境自动禁用更新）
    autoUpdater.checkForUpdatesAndNotify();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    });
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})