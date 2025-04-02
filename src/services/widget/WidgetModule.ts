import { NativeModules, Platform } from 'react-native';

interface WidgetModuleInterface {
  updateWidgets(): Promise<void>;
  configureWidget(
    widgetId: number,
    type: string,
    display: string,
    friendId?: string,
    friendName?: string
  ): Promise<void>;
}

// Default implementation (no-op) for platforms without widget support
const defaultImplementation: WidgetModuleInterface = {
  updateWidgets: async () => {},
  configureWidget: async () => {},
};

// Use the native module if available, otherwise use default implementation
export const WidgetModule: WidgetModuleInterface = 
  Platform.OS === 'android' && NativeModules.WidgetModule
    ? NativeModules.WidgetModule
    : defaultImplementation; 