package com.moodsync.app

import android.os.Build
import android.os.Bundle
import android.content.Context
import android.appwidget.AppWidgetManager
import android.app.NotificationChannel
import android.app.NotificationManager

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.ReactApplication

import expo.modules.ReactActivityDelegateWrapper
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import android.os.Handler
import android.os.Looper

class MainActivity : ReactActivity() {
  private val TAG = "MainActivity"

  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme)
    super.onCreate(savedInstanceState)
    
    // Initialize notification channels early
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        createNotificationChannel()
    }
    
    // Handle potential widget configuration intent
    val openWidgetConfig = intent.getBooleanExtra("openWidgetConfig", false)
    if (openWidgetConfig) {
        val widgetId = intent.getIntExtra("widgetId", AppWidgetManager.INVALID_APPWIDGET_ID)
        val widgetType = intent.getStringExtra("widgetType") ?: ""
        
        // Store this information for React Native to use
        val prefs = getSharedPreferences("widget_intent_data", Context.MODE_PRIVATE)
        prefs.edit()
            .putBoolean("has_widget_intent", true)
            .putInt("widget_id", widgetId)
            .putString("widget_type", widgetType)
            .apply()
        
        // Will emit event once React Native is ready
        Log.d("MainActivity", "Stored widget configuration intent: ID=$widgetId, Type=$widgetType")
    }

    // Handle widget click navigation when app is starting
    handleWidgetNavigation(intent)

    // Handle widget configuration intent
    handleWidgetIntent(intent)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    
    // Handle widget click navigation when app is already running
    handleWidgetNavigation(intent)

    // Handle widget configuration intent
    handleWidgetIntent(intent)
  }

  private fun handleWidgetNavigation(intent: Intent?) {
    try {
      if (intent?.action == "com.moodsync.app.OPEN_WIDGET_CONFIG") {
        Log.d(TAG, "Received widget config intent: ${intent.extras}")
        val widgetId = intent.getIntExtra("widgetId", -1)
        val widgetType = intent.getStringExtra("widgetType") ?: "unknown"
        
        // Wait briefly for React context to be ready
        android.os.Handler().postDelayed({
          try {
            val reactContext = (applicationContext as ReactApplication)
              .reactNativeHost
              .reactInstanceManager
              .currentReactContext
              
            reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              ?.emit("openWidgetConfig", Arguments.createMap().apply {
                putInt("widgetId", widgetId)
                putString("widgetType", widgetType)
              })
              
            Log.d(TAG, "Emitted openWidgetConfig event")
          } catch (e: Exception) {
            Log.e(TAG, "Error sending widget config event: ${e.message}", e)
          }
        }, 1000) // 1 second delay
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error handling widget navigation: ${e.message}", e)
    }
  }

  private fun handleWidgetIntent(intent: Intent?) {
    if (intent?.action == "com.moodsync.app.CONFIGURE_WIDGET") {
        val widgetId = intent.getIntExtra("widgetId", -1)
        val widgetType = intent.getStringExtra("widgetType") ?: ""
        val openWidgetConfig = intent.getBooleanExtra("openWidgetConfig", false)
        
        if (widgetId != -1 && openWidgetConfig) {
            Log.d(TAG, "Widget config requested for ID: $widgetId, Type: $widgetType")
            
            // Wait for React Native to be ready
            Handler(Looper.getMainLooper()).postDelayed({
                try {
                    val reactContext = (applicationContext as ReactApplication)
                        .reactNativeHost
                        .reactInstanceManager
                        .currentReactContext
                        
                    if (reactContext != null) {
                        val eventMap = Arguments.createMap().apply {
                            putInt("widgetId", widgetId)
                            putString("widgetType", widgetType)
                        }
                        
                        // Emit using DeviceEventEmitter which is more reliable
                        reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                            .emit("onWidgetConfigRequest", eventMap)
                        
                        Log.d(TAG, "Successfully emitted widget config event")
                    } else {
                        Log.e(TAG, "React context is null, storing intent for later")
                        // Store the intent data for later processing
                        val prefs = getSharedPreferences("widget_intent_data", Context.MODE_PRIVATE)
                        prefs.edit()
                            .putBoolean("has_widget_intent", true)
                            .putInt("widget_id", widgetId)
                            .putString("widget_type", widgetType)
                            .apply()
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error handling widget intent: ${e.message}", e)
                }
            }, 1000) // 1 second delay to ensure React Native is ready
        }
    }
  }

  // Add this method to emit the event once React Native is ready
  override fun onResume() {
    super.onResume()
    
    // Check if we have a pending widget intent
    val prefs = getSharedPreferences("widget_intent_data", Context.MODE_PRIVATE)
    val hasWidgetIntent = prefs.getBoolean("has_widget_intent", false)
    
    if (hasWidgetIntent) {
        // Get the stored widget data
        val widgetId = prefs.getInt("widget_id", AppWidgetManager.INVALID_APPWIDGET_ID)
        val widgetType = prefs.getString("widget_type", "")
        
        // Clear the flag so we don't emit this again
        prefs.edit().putBoolean("has_widget_intent", false).apply()
        
        // Need to delay the event emission until React Native is ready
        Handler(Looper.getMainLooper()).postDelayed({
            // Get the React application instance
            val reactApplication = application as ReactApplication
            val reactInstanceManager = reactApplication.reactNativeHost.reactInstanceManager
            val reactContext = reactInstanceManager.currentReactContext
            
            if (reactContext != null) {
                // Emit the event to React Native
                val eventMap = Arguments.createMap().apply {
                    putInt("widgetId", widgetId)
                    putString("widgetType", widgetType ?: "")
                }
                
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onWidgetConfigRequest", eventMap)
                
                Log.d("MainActivity", "Emitted widget config event to RN: ID=$widgetId, Type=$widgetType")
            } else {
                Log.e("MainActivity", "React context is null, couldn't emit widget event")
            }
        }, 1000) // Delay to ensure React Native is ready
    }
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val name = "Friend Mood Updates"
        val descriptionText = "Notifications when your friends update their moods"
        val importance = NotificationManager.IMPORTANCE_HIGH
        val channel = NotificationChannel("friend_updates", name, importance).apply {
            description = descriptionText
            enableLights(true)
            lightColor = 0xFFFF8800.toInt()
            enableVibration(true)
            vibrationPattern = longArrayOf(0, 100, 200, 300)
        }
        
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
      this,
      MainActivityDelegate(this, mainComponentName)
    )
  }

  class MainActivityDelegate(activity: ReactActivity?, mainComponentName: String?) :
    ReactActivityDelegate(activity, mainComponentName)

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }
}
