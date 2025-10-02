import { describe, it, expect, jest } from '@jest/globals';
import { FactoryMaker, DataCaptureContext, DataCaptureContextSettings, DataCaptureMode, ContextStatus, DataCaptureContextEvents, createNativeProxy, DataCaptureContextProxy } from 'scandit-datacapture-frameworks-core';
import { Capacitor, capacitorCoreNativeCaller, CapacitorWindow } from '../src/ts/Capacitor/Capacitor';

declare const window: CapacitorWindow;

class MockDataCaptureMode implements DataCaptureMode {
  isEnabled = false;
  context: DataCaptureContext | null = null;
  toJSON: () => object = () => new Object({
    name: 'MockDataCaptureMode'
  });
}

describe('DataCaptureContextProxyTests', () => {
  const mockWindow = window.Capacitor.Plugins[Capacitor.pluginName];

  FactoryMaker.bindLazyInstance('DataCaptureContextProxy', () => {
    return createNativeProxy<DataCaptureContextProxy>(capacitorCoreNativeCaller);
  });

  const context = DataCaptureContext.forLicenseKey('');

  const contextStatus = {
    code: 0,
    message: 'test',
    isValid: false
  };

  it('Check DataCaptureContext has been constructed', () => {
    expect(context).toBeTruthy();
    expect(mockWindow['contextFromJSON']).toHaveBeenCalledTimes(1);
  });

  it('Check updateContextFromJson call', () => {
    const settings = new DataCaptureContextSettings();
    context.applySettings(settings);

    expect(mockWindow['updateContextFromJSON']).toHaveBeenCalledTimes(1);
    expect(mockWindow['updateContextFromJSON']).toHaveBeenCalledWith(
      {
        contextJson: JSON.stringify(context.toJSON()),
      }
    );
  });

  it('Check addModeToContext call', () => {
    const mode = new MockDataCaptureMode();
    context.addMode(mode);

    expect(mockWindow['addModeToContext']).toHaveBeenCalledTimes(1);
    expect(mockWindow['addModeToContext']).toHaveBeenCalledWith(
      {
        modeJson: JSON.stringify(mode.toJSON()),
      }
    );
  });

  it('Check removeModeFromContext call', () => {
    const mode = new MockDataCaptureMode();
    context.addMode(mode);
    context.removeMode(mode);

    expect(mockWindow['removeModeFromContext']).toHaveBeenCalledTimes(1);
    expect(mockWindow['removeModeFromContext']).toHaveBeenCalledWith(
      {
        modeJson: JSON.stringify(mode.toJSON()),
      }
    );
  });

  it('didChangeStatus listener responds to events', () => {
    const statusPayload = {
      "status": JSON.stringify(contextStatus)
    }

    const payload = { name: DataCaptureContextEvents.didChangeStatus, data: JSON.stringify(statusPayload) };
    const fired = jest.fn();
    let result: ContextStatus | null = null;

    context.addListener({
      didChangeStatus: (_, contextStatus: ContextStatus) => {
        fired();
        result = contextStatus;
      }
    });

    window.Capacitor.__eventCallbacks[DataCaptureContextEvents.didChangeStatus](payload);

    expect(fired).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
    expect(result!.message).toEqual(contextStatus.message);
    expect(result!.code).toEqual(contextStatus.code);
    expect(result!.isValid).toEqual(contextStatus.isValid);
  });

  it('didStartObservingContext listener responds to events', () => {

    const payload = { name: DataCaptureContextEvents.didStartObservingContext };
    const fired = jest.fn();

    context.addListener({
      didStartObservingContext: _ => {
        fired();
      }
    });

    window.Capacitor.__eventCallbacks[DataCaptureContextEvents.didStartObservingContext](payload);

    expect(fired).toHaveBeenCalledTimes(1);
  });

  it('DataCaptureContextProxy sends unsubscription signal to Native', () => {
    context.dispose();
    expect(mockWindow['disposeContext']).toHaveBeenCalledTimes(1);
    // https://scandit.atlassian.net/browse/SDC-21050
    // expect that listeners are unsubscribed
  });
});
