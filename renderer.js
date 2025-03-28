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

