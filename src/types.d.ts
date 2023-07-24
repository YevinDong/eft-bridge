declare interface Window {
    WebViewJavascriptBridge: {
        callHandler: (callHundlerName: string, data: Record<string, any>, cb: (res: any) => void) => void;
        registerHandler: (
            registerHandlerName: string,
            cb: (data: any, next: (res: undefined | Record<string, any>) => void) => void
        ) => void;
    }
}