import { EventPayload } from 'scandit-datacapture-frameworks-core';
import { Capacitor, CapacitorWindow } from './Capacitor';
import { doReturnWithFinish } from './CommonCapacitor';

// To avoid a circular dependency. VolumeButtonObserver is only used here as a type.
declare type VolumeButtonObserver = any;
declare const window: CapacitorWindow;

enum VolumeButtonObserverEvent {
  DidChangeVolume = 'didChangeVolume',
}

export class VolumeButtonObserverProxy {
  private volumeButtonObserver: VolumeButtonObserver;
  private subscriber: any;

  public static forVolumeButtonObserver(volumeButtonObserver: VolumeButtonObserver): VolumeButtonObserverProxy {
    const proxy = new VolumeButtonObserverProxy();
    proxy.volumeButtonObserver = volumeButtonObserver;
    proxy.subscribe();
    return proxy;
  }

  public dispose(): void {
    this.unsubscribe();
  }

  private subscribe(): void {
    this.subscriber = window.Capacitor.Plugins[Capacitor.pluginName]
        .addListener(VolumeButtonObserverEvent.DidChangeVolume, this.notifyListeners.bind(this));
  }

  private unsubscribe(): void {
    this.subscriber.remove();
  }

  private notifyListeners(event: EventPayload) {
    if (!event) {
      // The event could be undefined/null in case the plugin result did not pass a "message",
      // which could happen e.g. in case of "ok" results, which could signal e.g. successful
      // listener subscriptions.
      return doReturnWithFinish('', null);
    }

    if (this.volumeButtonObserver.didChangeVolume && event.name === VolumeButtonObserverEvent.DidChangeVolume) {
      this.volumeButtonObserver.didChangeVolume();
      return doReturnWithFinish(event.name, null);
    }
  }
}
