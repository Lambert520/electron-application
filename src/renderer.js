const information = document.getElementById('info');
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;
const func = async () => {
    const response = await window.versions.ping();
    console.log(response);
}
func();
const func2 = () => {
    window.versions.setTitle("华流才是最屌的");
}
func2();

// 加减计算器
const counter = document.getElementById('counter')
window.versions.updateCounter((_event, value) => {
    const oldValue = Number(counter.innerText);
    const newValue = oldValue + value;
    counter.innerText = newValue.toString();
    window.versions.counterValue(newValue);
})

// 显示时间
const timeP = document.getElementById('timer');
window.versions.getTime((_event, time) => {
    timeP.innerText = time;
});

// 应用更新
let update_info = null; // 更新信息
const download = document.getElementById('download');
const progress = document.getElementById('progress');

window.versions.updateAvail((_event, info) => {
    progress.innerText = info.version + '...' + info.releaseDate + '---' + info.releaseNotes;
})
window.versions.onUpdate((_event, info) => {
    update_info = info;
    download.innerText = `检测到更新，安装包下载中...             +网速：${update_info.speed}         进度：${update_info.percent}`;
});
window.versions.onDownloaded(() => {
    update_info = null;
    let res = confirm('新版本已下载，是否立即安装？');
    if (res) {
        window.elecAPI.toInstall();
    }
});