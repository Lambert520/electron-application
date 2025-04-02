const { autoUpdater } = require('electron-updater');
var mainWin = null;

const checkUpdate = (win, ipcMain) => {
    autoUpdater.autoDownload = true; // 自动下载
    autoUpdater.autoInstallOnAppQuit = true; // 应用退出后自动安装
    mainWin = win;
    // 检测是否有更新包并通知
    autoUpdater.checkForUpdatesAndNotify().catch();
    // 监听渲染进程的 install 事件，触发退出应用并安装
    ipcMain.handle('install', () => autoUpdater.quitAndInstall());
};
// 下载进度
autoUpdater.on('download-progress', (prog) => {
    mainWin.webContents.send('update', {
        speed: Math.ceil(prog.bytesPerSecond / 1000), // 网速
        percent: Math.ceil(prog.percent), // 百分比
    });
});
// 下载完成
autoUpdater.on('update-downloaded', (info) => {
    mainWin.webContents.send('downloaded');
    // 下载完成后强制用户安装，不推荐
    // autoUpdater.quitAndInstall();
});

module.exports = checkUpdate;