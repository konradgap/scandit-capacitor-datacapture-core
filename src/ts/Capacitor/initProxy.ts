import { CameraProxy, createNativeProxy, DataCaptureContextProxy, FactoryMaker, ImageFrameSourceProxy } from 'scandit-datacapture-frameworks-core';
import { NativeFeedbackProxy } from './FeedbackProxy';
import { NativeDataCaptureViewProxy } from './DataCaptureViewProxy';
import { capacitorCoreNativeCaller } from './Capacitor';

export function initProxy() {
  FactoryMaker.bindInstance('DataCaptureViewProxy', new NativeDataCaptureViewProxy());
  FactoryMaker.bindInstance('FeedbackProxy', new NativeFeedbackProxy());

  FactoryMaker.bindLazyInstance('DataCaptureContextProxy', () => {
    return createNativeProxy<DataCaptureContextProxy>(capacitorCoreNativeCaller);
  });

  FactoryMaker.bindLazyInstance('CameraProxy', () => {
    return createNativeProxy<CameraProxy>(capacitorCoreNativeCaller);
  });

  FactoryMaker.bindLazyInstance('ImageFrameSourceProxy', () => {
    return createNativeProxy<ImageFrameSourceProxy>(capacitorCoreNativeCaller);
  });
}
