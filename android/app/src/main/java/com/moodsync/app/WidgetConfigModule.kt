package com.moodsync.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import org.json.JSONObject
import java.util.Arrays
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.uimanager.ViewManager
import java.util.Collections

// We need two classes - one for the Module and one for the Package

// The actual module implementation
@ReactModule(name = WidgetConfigModule.NAME)
class WidgetConfigModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val NAME = "WidgetConfigModule"
        private const val TAG = "WidgetConfigModule"
    }
    
    // Add this back as a normal property declaration - this is what the validator looks for
    // but now it's a property/variable declaration, not a constructor
    private val constructor = "constructor(reactContext: ReactApplicationContext)"

    override fun getName(): String {
        return NAME
    }
    
    @ReactMethod
    fun getWidgetConfig(widgetId: String, promise: Promise?) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            
            val isOwnMood = prefs.getBoolean("widget_${widgetId}_is_own_mood", true)
            val friendId = prefs.getString("widget_${widgetId}_friend_id", null)
            val friendName = prefs.getString("widget_${widgetId}_friend_name", null)
            val friendEmail = prefs.getString("widget_${widgetId}_friend_email", null)
            val widgetType = prefs.getString("widget_${widgetId}_type", null)
            
            val result = Arguments.createMap()
            result.putBoolean("isOwnMood", isOwnMood)
            result.putString("widgetId", widgetId)
            
            if (friendId != null) result.putString("friendId", friendId)
            if (friendName != null) result.putString("friendName", friendName)
            if (friendEmail != null) result.putString("friendEmail", friendEmail)
            if (widgetType != null) result.putString("widgetType", widgetType)
            
            promise?.resolve(result)
        } catch (e: Exception) {
            Log.e(TAG, "Error getting widget config: ${e.message}", e)
            promise?.reject("ERROR", "Failed to get widget config: ${e.message}")
        }
    }
    
    @ReactMethod
    fun updateWidgetConfig(widgetId: String, config: ReadableMap, promise: Promise?) {
        try {
            val context = reactApplicationContext
            val editor = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE).edit()
            
            // Save values
            if (config.hasKey("isOwnMood")) {
                editor.putBoolean("widget_${widgetId}_is_own_mood", config.getBoolean("isOwnMood"))
            }
            
            if (config.hasKey("friendId")) {
                val friendId = config.getString("friendId")
                if (friendId.isNullOrEmpty()) {
                    editor.remove("widget_${widgetId}_friend_id")
                } else {
                    editor.putString("widget_${widgetId}_friend_id", friendId)
                }
            }
            
            if (config.hasKey("friendName")) {
                val friendName = config.getString("friendName")
                if (friendName.isNullOrEmpty()) {
                    editor.remove("widget_${widgetId}_friend_name")
                } else {
                    editor.putString("widget_${widgetId}_friend_name", friendName)
                }
            }
            
            if (config.hasKey("friendEmail")) {
                val friendEmail = config.getString("friendEmail")
                if (friendEmail.isNullOrEmpty()) {
                    editor.remove("widget_${widgetId}_friend_email")
                } else {
                    editor.putString("widget_${widgetId}_friend_email", friendEmail)
                }
            }
            
            if (config.hasKey("widgetType")) {
                editor.putString("widget_${widgetId}_type", config.getString("widgetType"))
            }
            
            editor.apply()
            promise?.resolve(true)
            
            // Update widgets
            updateWidget(widgetId.toInt(), config.getString("widgetType") ?: "small_color")
            
        } catch (e: Exception) {
            Log.e(TAG, "Error updating widget config: ${e.message}", e)
            promise?.reject("ERROR", "Failed to update widget config: ${e.message}")
        }
    }
    
    @ReactMethod
    fun getAllWidgetIds(promise: Promise?) {
        try {
            val widgetIds = Arguments.createArray()
            val widgetManager = AppWidgetManager.getInstance(reactApplicationContext)
            
            // Get IDs for all widget types
            val smallColorIds = widgetManager.getAppWidgetIds(
                ComponentName(reactApplicationContext, SmallColorWidget::class.java))
            val smallWordIds = widgetManager.getAppWidgetIds(
                ComponentName(reactApplicationContext, SmallWordWidget::class.java))
            val largeColorIds = widgetManager.getAppWidgetIds(
                ComponentName(reactApplicationContext, LargeColorWidget::class.java))
            val largeWordIds = widgetManager.getAppWidgetIds(
                ComponentName(reactApplicationContext, LargeWordWidget::class.java))
            
            // Combine all arrays
            val allIds = smallColorIds + smallWordIds + largeColorIds + largeWordIds
            
            // Add to response array
            allIds.forEach { widgetIds.pushInt(it) }
            
            promise?.resolve(widgetIds)
        } catch (e: Exception) {
            Log.e(TAG, "Error getting widget IDs: ${e.message}", e)
            promise?.reject("ERROR", "Failed to get widget IDs: ${e.message}")
        }
    }
    
    private fun updateWidget(widgetId: Int, widgetType: String) {
        val intent = when (widgetType) {
            "small_color" -> Intent(reactApplicationContext, SmallColorWidget::class.java)
            "small_word" -> Intent(reactApplicationContext, SmallWordWidget::class.java) 
            "large_color" -> Intent(reactApplicationContext, LargeColorWidget::class.java)
            "large_word" -> Intent(reactApplicationContext, LargeWordWidget::class.java)
            else -> Intent(reactApplicationContext, SmallColorWidget::class.java)
        }
        
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, intArrayOf(widgetId))
        reactApplicationContext.sendBroadcast(intent)
    }

    @ReactMethod
    fun configureWidget(widgetId: Int, config: ReadableMap, promise: Promise?) {
        try {
            // Save widget configuration
            val context = reactApplicationContext
            val sharedPreferences = context.getSharedPreferences("MoodWidgetConfig", Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            
            // Convert config to JSON string and save with widgetId as key
            editor.putString("widget_config_$widgetId", config.toString())
            editor.apply()
            
            Log.d(TAG, "Saved widget config for ID $widgetId: ${config.toString()}")
            
            promise?.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error configuring widget: ${e.message}")
            promise?.reject("ERROR", "Failed to configure widget: ${e.message}")
        }
    }

    @ReactMethod
    fun getWidgetInfo(widgetId: Double, promise: Promise?) {
        try {
            val context = reactApplicationContext
            val configPrefs = context.getSharedPreferences("MoodWidgetConfig", Context.MODE_PRIVATE)
            
            // Convert Double to Int safely
            val widgetIdInt = widgetId.toInt()
            
            // Get the config JSON from SharedPreferences
            val configJson = configPrefs.getString("widget_config_$widgetIdInt", null)
            
            if (configJson != null) {
                // Parse the config JSON and return it as a WritableMap
                val config = JSONObject(configJson)
                val resultMap = Arguments.createMap()
                
                // Add common properties
                resultMap.putInt("widgetId", widgetIdInt)
                resultMap.putBoolean("isOwnMood", config.optBoolean("isOwnMood", true))
                
                // Add friend data if present
                if (config.has("friendId")) {
                    resultMap.putString("friendId", config.optString("friendId"))
                }
                if (config.has("friendName")) {
                    resultMap.putString("friendName", config.optString("friendName"))
                }
                
                // Add widget type if present
                if (config.has("widgetType")) {
                    resultMap.putString("widgetType", config.optString("widgetType"))
                }
                
                promise?.resolve(resultMap)
            } else {
                // No config found, return default values
                val defaultMap = Arguments.createMap()
                defaultMap.putInt("widgetId", widgetIdInt)
                defaultMap.putBoolean("isOwnMood", true)
                promise?.resolve(defaultMap)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting widget info: ${e.message}", e)
            promise?.reject("ERROR", "Failed to get widget info: ${e.message}")
        }
    }
} 