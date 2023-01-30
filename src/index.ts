import { getIsApp } from "./utils";
import { version } from "../package.json";
import { init as registryInit, type I_BRIDGE } from "./registry";
const isApp = getIsApp();
const readyBuckte = [];
export interface BRIDGE_EXPORT {
    bridge: I_BRIDGE,
    isInit: boolean,
    isApp: boolean,
}
let _export = {
    bridge: {},
    isInit: false,
    isApp: false,
} as BRIDGE_EXPORT
export function useBridge() {
    // # 是否进行过初始化
    if (_export.isInit) return _export;
    else _export.isInit = true;

    // # 如果不在app环境中
    if (!isApp) {
        console.log(`⚠️eft-bridge not running in the app`);
    } else {
        console.log(`✅eft-bridge version: v${version}`);
        // # 导出bridge
        _export.isApp = isApp;
        _export.bridge = registryInit();
    }
    // # 不管是否是app中都消费掉Buckte中得函数
    consumeReadyBuckte();
    return _export
}

function consumeReadyBuckte() {
    while (readyBuckte.length) {
        const fn = readyBuckte.shift();
        typeof fn === 'function' && fn(_export);
    }
}
export function ready(fn: (bridge: BRIDGE_EXPORT) => any): void {
    if (typeof fn !== 'function') return;
    if (_export.isInit) fn(_export);
    else readyBuckte.push(fn);
    return void 0;
}
export default useBridge;

