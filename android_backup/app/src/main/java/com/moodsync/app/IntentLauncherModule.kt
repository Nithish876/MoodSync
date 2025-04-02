package com.moodsync.app

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import com.facebook.react.bridge.*

class IntentLauncherModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val NAME = "IntentLauncherModule"
        private const val TAG = "IntentLauncherModule"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun openAppWidget(promise: Promise?) {
        try {
            val context = reactApplicationContext
            val packageManager = context.packageManager
            
            // Try to find any existing widgets
            val appWidgetManager = AppWidgetManager.getInstance(context)
            
            // Check for each widget type
            val widgetClasses = arrayOf(
                SmallColorWidget::class.java,
                SmallWordWidget::class.java, 
                LargeColorWidget::class.java,
                LargeWordWidget::class.java
            )
            
            var foundWidgetId = -1
            var foundWidgetType = ""
            
            // Look for widgets of each type
            for (widgetClass in widgetClasses) {
                val componentName = ComponentName(context, widgetClass)
                val ids = appWidgetManager.getAppWidgetIds(componentName)
                
                if (ids.isNotEmpty()) {
                    foundWidgetId = ids[0]
                    foundWidgetType = when(widgetClass) {
                        SmallColorWidget::class.java -> "small_color"
                        SmallWordWidget::class.java -> "small_word"
                        LargeColorWidget::class.java -> "large_color"
                        LargeWordWidget::class.java -> "large_word"
                        else -> "unknown"
                    }
                    break
                }
            }
            
            if (foundWidgetId == -1) {
                throw Exception("No widgets found")
            }
                
            // Create intent with specific type to avoid ambiguity
            val intent = Intent(Intent.ACTION_MAIN)
            intent.addCategory(Intent.CATEGORY_LAUNCHER)
            val componentInfo = packageManager.getLaunchIntentForPackage(context.packageName)?.component
            intent.component = componentInfo
            intent.putExtra("widgetId", foundWidgetId)
            intent.putExtra("widgetType", foundWidgetType)
            intent.putExtra("screen", "widget_config")
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            
            context.startActivity(intent)
            promise?.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to open app widget: ${e.message}")
            promise?.reject("ERROR", "Failed to open app widget: ${e.message}")
        }
    }
} 