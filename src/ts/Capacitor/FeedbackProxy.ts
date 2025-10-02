import { Feedback, FeedbackProxy } from 'scandit-datacapture-frameworks-core';
import { Capacitor, CapacitorFunction, CapacitorWindow } from './Capacitor';

declare const window: CapacitorWindow;

export class NativeFeedbackProxy implements FeedbackProxy {
    emitFeedback(feedback: Feedback): Promise<void> {
        return window.Capacitor.Plugins[Capacitor.pluginName][CapacitorFunction.EmitFeedback](
            {feedback: JSON.stringify(feedback.toJSON())},
        );
    }
}
