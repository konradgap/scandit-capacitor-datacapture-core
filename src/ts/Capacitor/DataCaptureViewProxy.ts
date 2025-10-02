import {
    DataCaptureViewProxy,
    BaseNativeProxy,
    DataCaptureViewEvents,
    EventPayload,
    NativeCallResult,
} from 'scandit-datacapture-frameworks-core';
import { Capacitor, CapacitorFunction, CapacitorWindow } from './Capacitor';

declare const window: CapacitorWindow;

export class NativeDataCaptureViewProxy extends BaseNativeProxy implements DataCaptureViewProxy {
    public setPositionAndSize(
        top: number, left: number, width: number, height: number, shouldBeUnderWebView: boolean): Promise<void> {
        return new Promise((resolve, reject) =>
            window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SetViewPositionAndSize](
                {
                    position: { top, left, width, height, shouldBeUnderWebView },
                },
            ).then(resolve.bind(this), reject.bind(this)));
    }

    public show(): Promise<void> {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.ShowView]();
    }

    public hide(): Promise<void> {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.HideView]();
    }

    public viewPointForFramePoint({ viewId, pointJson }: { viewId: number, pointJson: string }): Promise<NativeCallResult> {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.ViewPointForFramePoint](
            {
                viewId: viewId,
                point: pointJson,
            },
        );
    }

    public viewQuadrilateralForFrameQuadrilateral({ viewId, quadrilateralJson }: { viewId: number, quadrilateralJson: string }): Promise<NativeCallResult> {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.ViewQuadrilateralForFrameQuadrilateral](
            {
                viewId: viewId,
                quadrilateral: quadrilateralJson,
            },
        )
    }

    public createView(viewJson: string): Promise<void> {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.CreateDataCaptureView](
            {
                viewJson: viewJson,
            },
        );
    }

    public updateView(viewJson: string): Promise<void> {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.UpdateDataCaptureView](
            {
                viewJson: viewJson,
            },
        );
    }


    public removeView(viewId: number): Promise<void> {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.RemoveDataCaptureView](
            {
                viewId: viewId,
            },
        );
    }

    registerListenerForViewEvents(viewId: number): void {
        window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.SubscribeViewListener](
            {
                viewId: viewId,
            },
        );
    }

    unregisterListenerForViewEvents(viewId: number): void {
        window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.UnsubscribeViewListener](
            {
                viewId: viewId,
            },
        );
    }

    subscribeDidChangeSize(): void {
        window.Capacitor.Plugins[Capacitor.pluginName]
            .addListener(DataCaptureViewEvents.didChangeSize, this.notifyListeners.bind(this));
    }

    private notifyListeners(event: EventPayload) {
        if (!event) {
            // The event could be undefined/null in case the plugin result did not pass a "message",
            // which could happen e.g. in case of "ok" results, which could signal e.g. successful
            // listener subscriptions.
            return;
        }

        switch (event.name) {
            case DataCaptureViewEvents.didChangeSize:
                this.eventEmitter.emit(DataCaptureViewEvents.didChangeSize, event.data);
                break;
        }

    }

}
