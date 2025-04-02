import { useEffect } from 'react';
import { NativeModules } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const { WidgetIntentModule } = NativeModules;

type RootStackParamList = {
  WidgetConfig: {
    widgetId: number;
  };
};

export function useWidgetIntents() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  useEffect(() => {
    // Check if we were launched from a widget
    const checkForWidgetIntent = async () => {
      try {
        const hasIntent = await WidgetIntentModule.hasWidgetConfigIntent();
        if (hasIntent) {
          // Get the widget ID and type
          const widgetId = await WidgetIntentModule.getWidgetId();
          
          // Navigate to the widget config screen
          navigation.navigate('WidgetConfig', { widgetId });
          
          // Clear the intent data
          await WidgetIntentModule.clearWidgetIntent();
        }
      } catch (error) {
        console.error('Error checking widget intent:', error);
      }
    };
    
    checkForWidgetIntent();
  }, [navigation]);
} 