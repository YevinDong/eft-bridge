declare interface Window {
    WebViewJavascriptBridge: {
        callHandler: (callHundlerName: string, data: Record<string, any>, cb: (res: any) => void) => void;
        registerHandler: (
            registerHandlerName: string,
            cb: (data: any, next: () => void) => void
        ) => void;
    }
}