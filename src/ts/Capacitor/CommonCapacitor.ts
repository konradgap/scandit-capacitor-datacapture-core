import { CapacitorWindow } from './Capacitor';
import { Optional } from '../../definitions';

declare const window: CapacitorWindow;

export class CapacitorError {
    public static fromJSON(json: any): Optional<CapacitorError> {
        if (json && json.code && json.message) {
            return new CapacitorError(json.code, json.message);
        } else {
            return null;
        }
    }

    constructor(
        public code: number,
        public message: string,
    ) {
    }
}

export interface BlockingModeListenerResult {
    enabled: boolean;
}

export const capacitorExec = (
    successCallback: Optional<Function>,
    errorCallback: Optional<Function>,
    pluginName: string,
    functionName: string,
    args: Optional<[any]>,
) => {
    if ((window as any).Scandit && (window as any).Scandit.DEBUG) {
        // tslint:disable-next-line:no-console
        console.log(`Called native function: ${functionName}`, args, {success: successCallback, error: errorCallback});
    }
    const extendedSuccessCallback = (message: any) => {
        const shouldCallback = message && message.shouldNotifyWhenFinished;
        const finishCallbackID = shouldCallback ? message.finishCallbackID : null;

        const started = Date.now();

        let callbackResult;
        if (successCallback) {
            callbackResult = successCallback(message);
        }

        if (shouldCallback) {
            const maxCallbackDuration = 50;
            const callbackDuration = Date.now() - started;

            if (callbackDuration > maxCallbackDuration) {
                // tslint:disable-next-line:no-console
                console.log(`[SCANDIT WARNING] Took ${callbackDuration}ms to execute callback that's blocking native execution. You should keep this duration short, for more information, take a look at the documentation.`);
            }

            window.Capacitor.Plugins[pluginName].finishCallback([{
                finishCallbackID,
                result: callbackResult,
            }]);
        }
    };

    const extendedErrorCallback = (error: any) => {
        if (errorCallback) {
            const capacitorError = CapacitorError.fromJSON(error);

            if (capacitorError !== null) {
                error = capacitorError;
            }

            errorCallback(error);
        }
    };

    window.Capacitor.Plugins[pluginName][functionName](args).then(extendedSuccessCallback, extendedErrorCallback);
};

export const doReturnWithFinish = (finishCallbackID: string, result: any) => {
    if (window.Capacitor.Plugins.ScanditBarcodeNative) {
        window.Capacitor.Plugins.ScanditBarcodeNative.finishCallback({result: {finishCallbackID, ...result}});
    } else if (window.Capacitor.Plugins.ScanditIdNative) {
        window.Capacitor.Plugins.ScanditIdNative.finishCallback({result: {finishCallbackID, ...result}});
    }
    return result;
};
