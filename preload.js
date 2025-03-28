const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // 渲染进程向主进程通信（双向）
    ping: () => ipcRenderer.invoke('ping'),
    // 渲染进程向主进程通信（单向）
    setTitle: (title) => ipcRenderer.send('set-title', title),

    // 除函数之外，我们也可以暴露变量
})