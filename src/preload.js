const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // 渲染进程向主进程通信（双向）
    ping: () => ipcRenderer.invoke('ping'),
    // 渲染进程向主进程通信（单向）
    setTitle: (title) => ipcRenderer.send('set-title', title),
    // 渲染进程向主进程通信（单向）
    counterValue: (value) => ipcRenderer.send('counter-value', value),
    updateCounter: (callback) => ipcRenderer.on('update-counter', callback),
    // 获取当前时间
    getTime: (callback) => ipcRenderer.on('getTime', callback),
    // 下载相关方法
    toInstall: () => ipcRenderer.invoke('install'),
    onUpdate: (callback) => ipcRenderer.on('update', callback),
    onDownloaded: (callback) => ipcRenderer.on('downloaded', callback),
    // 除函数之外，我们也可以暴露变量
})