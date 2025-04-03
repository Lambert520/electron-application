const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// 配置日志输出到文件和控制台
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let mainWin = null;

const checkUpdate = (win, ipcMain) => {
  mainWin = win;

  // 配置自动更新参数
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false; // 只接收正式版更新
  autoUpdater.allowDowngrade = false; // 禁止降级
  autoUpdater.fullChangelog = true; // 显示完整更新日志

  // 启动更新检查
  autoUpdater.checkForUpdatesAndNotify().catch(err => {
    log.error('更新检查失败:', err);
    mainWin.webContents.send('update-error', err.message);
  });

  // 监听安装事件
  ipcMain.handle('install', () => {
    if (autoUpdater.updateDownloaded) {
      autoUpdater.quitAndInstall(true, true); // 强制立即重启
    } else {
      log.warn('尝试安装未下载的更新');
    }
  });
};

// 事件监听增强版
autoUpdater.on('update-available', (info) => {
  log.info('发现新版本:', info.version);
  mainWin.webContents.send('update-available', {
    version: info.version,
    releaseDate: info.releaseDate,
    releaseNotes: info.releaseNotes
  });
});

autoUpdater.on('download-progress', (prog) => {
  const payload = {
    speed: Math.ceil(prog.bytesPerSecond / 1024), // KB/s
    percent: prog.percent.toFixed(1),
    total: (prog.total / 1024 / 1024).toFixed(1) + 'MB',
    transferred: (prog.transferred / 1024 / 1024).toFixed(1) + 'MB'
  };
  mainWin.webContents.send('download-progress', payload);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('更新包下载完成:', info.version);
  mainWin.webContents.send('update-downloaded', {
    version: info.version,
    autoInstall: autoUpdater.autoInstallOnAppQuit
  });
});

// 错误处理必须添加
autoUpdater.on('error', (err) => {
  log.error('更新错误:', err);
  mainWin.webContents.send('update-error', {
    message: err.message,
    stack: err.stack
  });
});

module.exports = checkUpdate;