import { NativeModules } from 'react-native';

export const debugNativeMethods = () => {
  console.log('=== Available WidgetModule Methods ===');
  const methods = Object.keys(NativeModules.WidgetModule || {});
  methods.forEach(method => console.log(`- ${method}`));
  
  console.log('\n=== Available WidgetConfigModule Methods ===');
  const configMethods = Object.keys(NativeModules.WidgetConfigModule || {});
  configMethods.forEach(method => console.log(`- ${method}`));
  
  return {
    widgetModuleMethods: methods,
    widgetConfigModuleMethods: configMethods
  };
}; 