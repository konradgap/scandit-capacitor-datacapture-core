import {
    CoreDefaults,
    getCoreDefaults,
    loadCoreDefaults,
    NativeCaller
} from 'scandit-datacapture-frameworks-core';
import {capacitorExec} from './CommonCapacitor';
import {Optional} from '../../definitions';

export enum CapacitorFunction {
    GetDefaults = 'getDefaults',

    SetViewPositionAndSize = 'setViewPositionAndSize',
    ShowView = 'showView',
    HideView = 'hideView',
    ViewPointForFramePoint = 'viewPointForFramePoint',
    ViewQuadrilateralForFrameQuadrilateral = 'viewQuadrilateralForFrameQuadrilateral',
    SubscribeViewListener = 'subscribeViewListener',
    UnsubscribeViewListener = 'unsubscribeViewListener',

    GetCurrentCameraState = 'getCurrentCameraState',
    GetIsTorchAvailable = 'getIsTorchAvailable',
    RegisterListenerForCameraEvents = 'registerListenerForCameraEvents',
    UnregisterListenerForCameraEvents = 'unregisterListenerForCameraEvents',

    SwitchCameraToDesiredState = 'switchCameraToDesiredState',

    GetFrame = 'getFrame',

    EmitFeedback = 'emitFeedback',

    SubscribeVolumeButtonObserver = 'subscribeVolumeButtonObserver',
    UnsubscribeVolumeButtonObserver = 'unsubscribeVolumeButtonObserver',

    CreateDataCaptureView = 'createDataCaptureView',
    UpdateDataCaptureView = 'updateDataCaptureView',
    RemoveDataCaptureView = 'removeDataCaptureView'
}

export interface CapacitorWindow extends Window {
    Scandit: any;
    Capacitor: any;
}

declare const window: CapacitorWindow;

export const pluginName = 'ScanditCaptureCoreNative';

// tslint:disable-next-line:variable-name
export const Capacitor = {
    pluginName,
    defaults: {} as CoreDefaults,
    exec: (
        success: Optional<Function>,
        error: Optional<Function>,
        functionName: string,
        args: Optional<[any]>,
    ) => capacitorExec(success, error, pluginName, functionName, args),
};

export const getDefaults = async (): Promise<CoreDefaults> => {
    try {
        const defaultsJson = await window.Capacitor.Plugins[pluginName][CapacitorFunction.GetDefaults]();
        loadCoreDefaults(defaultsJson);
        Capacitor.defaults = getCoreDefaults();
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.warn(error);
    }

    return Capacitor.defaults;
};

export class CapacitorNativeCaller implements NativeCaller {

    constructor(private pluginName: string) {}

    get framework(): string {
        return 'capacitor';
    }

    get frameworkVersion(): string {
        return (() => (Capacitor.defaults as any).capacitorVersion)();
    }

    callFn(fnName: string, args: object | undefined | null): Promise<any> {
        return window.Capacitor.Plugins[this.pluginName][fnName](args)
    }

    registerEvent(evName: string, handler: (args: any) => Promise<void>): Promise<any> {
        return window.Capacitor.Plugins[this.pluginName]
            .addListener(evName, handler);
    }

    async unregisterEvent(_evName: string, subscription: any): Promise<void> {
        if (subscription) {
            await subscription.remove();
        }
    }

    eventHook(ev: any): any {
        return ev;
    }
}

export const capacitorCoreNativeCaller = new CapacitorNativeCaller(Capacitor.pluginName);
