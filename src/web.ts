import { registerPlugin } from '@capacitor/core';
import { ScanditCaptureCorePluginInterface } from './definitions';
import { getDefaults } from './ts/Capacitor/Capacitor';
import { initProxy } from './ts/Capacitor/initProxy';

export * from './definitions';

import * as CoreExports from './definitions';

interface CoreWindow extends Window {
    Scandit: any;
    Capacitor: any;
}

declare let window: CoreWindow;
const corePluginName = 'ScanditCaptureCorePlugin';

initProxy();

export class ScanditCaptureCorePluginImplementation implements ScanditCaptureCorePluginInterface {
    public async initializePlugins(): Promise<any> {
        const coreDefaults = await getDefaults();

        let api = { 
            ...CoreExports
        };

        for (const key of Object.keys(window.Capacitor.Plugins)) {
            if (key.startsWith('Scandit') && key.indexOf('Native') < 0 && key !== corePluginName) {
                await window.Capacitor.Plugins[key].initialize(coreDefaults)
                    .then((pluginApi: any) => {
                        api = { ...api, ...pluginApi };
                    });
            }
        }

        return api;
    }
}

registerPlugin<ScanditCaptureCorePluginImplementation>(corePluginName, {
    android: () => new ScanditCaptureCorePluginImplementation(),
    ios: () => new ScanditCaptureCorePluginImplementation(),
    web: () => new ScanditCaptureCorePluginImplementation(),
});

// tslint:disable-next-line:variable-name
export const ScanditCaptureCorePlugin = new ScanditCaptureCorePluginImplementation();
