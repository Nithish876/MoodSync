/**
 * Safely converts widget IDs to strings for native module calls
 * This prevents Double-to-String casting errors in the native code
 */
export const prepareWidgetId = (widgetId: number | string): string => {
  return String(widgetId);
};

/**
 * Safe wrapper for calling native widget methods
 * Handles all type conversions needed
 */
export const callWidgetMethod = async (
  module: any, 
  methodName: string, 
  widgetId: number | string,
  ...otherArgs: any[]
) => {
  const widgetIdStr = prepareWidgetId(widgetId);
  return await module[methodName](widgetIdStr, ...otherArgs);
}; 