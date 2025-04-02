import AsyncStorage from '@react-native-async-storage/async-storage';
import { WidgetModule } from './WidgetModule';

interface WidgetConfig {
  widgetId: number;
  type: 'own' | 'friend';
  display: 'color' | 'word';
  friendId?: string;
  friendName?: string;
}

export const AndroidWidgetService = {
  /**
   * Update the user's mood data that will be displayed in widgets
   */
  async updateUserMood(color: string, text: string): Promise<void> {
    try {
      // Store in AsyncStorage for widgets to access
      await AsyncStorage.setItem('user_mood_color', color);
      await AsyncStorage.setItem('user_mood_text', text);
      
      // Trigger widget update
      await WidgetModule.updateWidgets();
      console.log('Updated user mood data for widgets');
    } catch (error) {
      console.error('Failed to update widget mood data:', error);
    }
  },
  
  /**
   * Update a friend's mood data
   */
  async updateFriendMood(friendId: string, friendName: string, color: string, text: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`friend_${friendId}_mood_color`, color);
      await AsyncStorage.setItem(`friend_${friendId}_mood_text`, text);
      await AsyncStorage.setItem(`friend_${friendId}_name`, friendName);
      
      // Trigger widget update
      await WidgetModule.updateWidgets();
      console.log(`Updated mood data for friend ${friendName}`);
    } catch (error) {
      console.error('Failed to update friend mood data:', error);
    }
  },
  
  /**
   * Configure a widget
   */
  async configureWidget(config: WidgetConfig): Promise<void> {
    try {
      const { widgetId, type, display, friendId, friendName } = config;
      
      // Store configuration in AsyncStorage
      await AsyncStorage.setItem(`widget_${widgetId}_type`, type);
      await AsyncStorage.setItem(`widget_${widgetId}_display`, display);
      
      if (type === 'friend' && friendId && friendName) {
        await AsyncStorage.setItem(`widget_${widgetId}_friend_id`, friendId);
        await AsyncStorage.setItem(`widget_${widgetId}_friend_name`, friendName);
      }
      
      // For large 4x2 widgets, store friend info in special keys
      if (String(widgetId).includes('4x2')) {
        await AsyncStorage.setItem(`large_widget_${widgetId}_friend_id`, friendId || '');
        await AsyncStorage.setItem(`large_widget_${widgetId}_friend_name`, friendName || 'Friend');
      }
      
      // Update widget via native module
      await WidgetModule.configureWidget(widgetId, type, display, friendId, friendName);
      console.log(`Configured widget ${widgetId}`);
    } catch (error) {
      console.error('Failed to configure widget:', error);
    }
  }
}; 