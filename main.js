/*
    app: 控制应用程序的事件生命周期
    BrowserWindow: 创建和管理 app 的窗口
*/
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // 将预加载脚本附在渲染进程上(path.join创建一个跨平台的路径字符串)
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadFile('index.html');
}
app.whenReady().then(() => {
    // handle监听器
    ipcMain.handle('ping', () => 'pong');
    // ipcMain.handle('getData', (data) => console.log("获取到的数据是", data));
    createMainWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})