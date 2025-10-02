import { VolumeButtonObserverProxy } from './Capacitor/VolumeButtonObserverProxy';

export class VolumeButtonObserver {
  private didChangeVolume: (() => void) | null;
  private proxy: VolumeButtonObserverProxy | null;

  public constructor(didChangeVolume: () => void) {
    this.didChangeVolume = didChangeVolume;
    this.initialize();
  }

  public dispose() {
    if (this.proxy) {
      this.proxy.dispose();
      this.proxy = null;
      this.didChangeVolume = null;
    }
  }

  private initialize() {
    if (!this.proxy) {
      this.proxy = VolumeButtonObserverProxy.forVolumeButtonObserver(this);
    }
  }
}
