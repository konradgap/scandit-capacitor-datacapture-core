import { jest } from '@jest/globals';
import { Capacitor } from '../src/ts/Capacitor/Capacitor';

const eventCallbacks = {};

const pluginFunctionsMock = {
  addListener: jest.fn((eventName: string, callback) => {
    // Store the callback using the event name as the key
    eventCallbacks[eventName] = callback;
  }),

  ['subscribeContextListener']: jest.fn(),
  ['unsubscribeContextListener']: jest.fn(),
  ['contextFromJSON']: jest.fn().mockReturnValue({'data': '{}'}),
  ['updateContextFromJSON']: jest.fn(),
  ['addModeToContext']: jest.fn(),
  ['removeModeFromContext']: jest.fn(),
  ['removeAllModes']: jest.fn(),
  ['disposeContext']: jest.fn(),
  // Add any other mock functions as needed
};

const capacitorMock = {
  Plugins: {
    [Capacitor.pluginName]: pluginFunctionsMock,
  },
  __eventCallbacks: eventCallbacks,
};

(window as any).Capacitor = capacitorMock;
