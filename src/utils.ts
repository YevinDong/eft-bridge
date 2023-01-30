export const userAgent = window.navigator.userAgent;
export const uaCassavaReg = /(Cassava)\/(.+)\/(\d+)/;
export function getUaInfo() {
    const exec_res = uaCassavaReg.exec(userAgent);
    if (exec_res) {
        const { "0": injectString, "1": identifier, "2": appVersion, "3": SDKVersion } = exec_res;
        return {
            injectString,
            identifier,
            appVersion,
            SDKVersion
        }
    } else return {
        injectString: "",
        identifier: "",
        appVersion: "",
        SDKVersion: ""
    };
}
export function getIsApp() {
    const { identifier } = getUaInfo();
    if (identifier === 'Cassava') return true;
    else return false;
} 