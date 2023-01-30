import { useBridge } from "./index";
const { bridge, isApp } = useBridge();
const write = (str) => {
    document.getElementById('box').innerHTML = str;
}
async function run() {
    console.log('##########注册监听 callJs');
    bridge.on("callJs", (data) => {
        console.log(`#######callJs 被调用`);
        console.log(data);
        write(JSON.stringify(data));
    })
    console.log('##########注册监听 callJs2');
    bridge.on("callJs2", (data) => {
        console.log(`#######callJs2 被调用`);
        console.log(data);
        write(JSON.stringify(data));
    })




    const c1 = document.getElementById('c1');
    console.log('c1: ', c1);
    const c2 = document.getElementById('c2');
    c1.onclick = function () {
        console.log('##########发送1');
        bridge.call({
            "opt": "getDeviceInfo",
            "body": {
                "id": 9999,
            }
        }, (res) => {
            console.log(`#######接收到1`);
            console.log(res);
            write(JSON.stringify(res));
        })
    }

    c2.onclick = async function () {
        console.log('##########发送2');
        const res = await bridge.call({
            "opt": "getDeviceInfo",
            "body": {
                "id": 8888,
            }
        })
        console.log(`#######接收到2`);
        console.log(res);
        write(JSON.stringify(res));
    }
}



isApp && run()