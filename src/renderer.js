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
window.versions.updateCounter((value) => {
    const oldValue = Number(counter.innerText);
    const newValue = oldValue + value;
    counter.innerText = newValue.toString();
    window.versions.counterValue(newValue);
})

// 显示时间
const timeP = document.getElementById('timer');
window.versions.getTime((time)=>{
    timeP.innerText = time;
});