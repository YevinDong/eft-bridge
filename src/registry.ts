import { kindof } from "./utils"
let origin_bridge: Window['WebViewJavascriptBridge'] = null;
const FN_NAME = {
    JS_CALL_NATIVE: "jsCallNative",
    NATIVE_CALL_JS: "nativeCallJs",
}
type I_BRIDGE_ON =
    ((data: Record<string, any>) => Promise<any>) |
    ((data: Record<string, any>, cb?: (res: any) => void) => any);
export interface I_BRIDGE {
    call: I_BRIDGE_ON,
    on: any,
    off: any
}
const native_call_js_bucket: Map<string, Set<(res: any) => Record<string, any>>> = new Map();
let bridge: I_BRIDGE = {} as I_BRIDGE;
export function init(): I_BRIDGE {
    if (origin_bridge) {
        return bridge;
    }
    origin_bridge = window.WebViewJavascriptBridge;
    if (!origin_bridge) {
        console.log(`⛔eft-bridge webview inject error`);
        return bridge
    }

    initNativeCallJs();
    bridge.call = bridgeCall;
    bridge.on = bridgeOn;
    bridge.off = bridgeOff;

    return bridge;
}

function bridgeCall(data: Record<string, any>): Promise<any>;
function bridgeCall(data: Record<string, any>, cb?: (res: any) => void) {
    if (cb) {
        origin_bridge.callHandler(FN_NAME.JS_CALL_NATIVE, data, cb);
        return void 0;
    } else {
        return new Promise((resolve, reject) => {
            try {
                origin_bridge.callHandler(FN_NAME.JS_CALL_NATIVE, data, (res) => resolve(res))
            } catch (err) {
                reject(err);
            }
        })
    }
}

function initNativeCallJs() {
    origin_bridge.registerHandler(FN_NAME.NATIVE_CALL_JS, async (data, next) => {
        console.log('native all js : ', data.opt);
        if (data && data.opt) {
            const { opt } = data;
            const fns = native_call_js_bucket.get(opt);

            if (fns && fns?.size) {
                let res = []
                let size = fns.size;
                let i = 0;
                fns.forEach(async (fn) => {
                    let index = i++;
                    if (typeof fn === 'function') {
                        let ans = await fn(data);
                        if (kindof(ans) !== 'object') ans = { res: ans }
                        res[index] = ans;
                    } else {
                        res[index] = { error: 'fn is not a function' };
                    }

                    if (i === size) {
                        if (res.length === 1) next(res[0]);
                        else next({ res })
                    }
                })

            }
        } else {
            next({ error: 'opt is not exist' });
        }
    })
}

function bridgeOn(event: string, cb: (res: any) => any) {
    if (!native_call_js_bucket.has(event)) {
        native_call_js_bucket.set(event, new Set());
    }
    native_call_js_bucket.get(event).add(cb);
}

function bridgeOff(event: string, cb: any) {
    const fns = native_call_js_bucket.get(event);
    if (fns?.size) fns.delete(cb);
}