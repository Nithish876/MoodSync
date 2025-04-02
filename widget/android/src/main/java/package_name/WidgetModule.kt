package com.example.app

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = WidgetModule.NAME)
class WidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val NAME = "WidgetModule"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun updateWidgets(promise: Promise) {
        try {
            val context = reactApplicationContext
            val appWidgetManager = AppWidgetManager.getInstance(context)
            
            // Update small widgets
            val smallWidgetIntent = Intent(context, SmallWidget::class.java)
            smallWidgetIntent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val smallWidgetIds = appWidgetManager.getAppWidgetIds(ComponentName(context, SmallWidget::class.java))
            smallWidgetIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, smallWidgetIds)
            context.sendBroadcast(smallWidgetIntent)
            
            // Update large widgets
            val largeWidgetIntent = Intent(context, LargeWidget::class.java)
            largeWidgetIntent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val largeWidgetIds = appWidgetManager.getAppWidgetIds(ComponentName(context, LargeWidget::class.java))
            largeWidgetIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, largeWidgetIds)
            context.sendBroadcast(largeWidgetIntent)
            
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to update widgets: ${e.message}")
        }
    }

    @ReactMethod
    fun configureWidget(widgetId: Int, type: String, display: String, friendId: String?, friendName: String?, promise: Promise) {
        try {
            val context = reactApplicationContext
            val sharedPreferences = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            
            // Save configuration to SharedPreferences
            editor.putString("widget_${widgetId}_type", type)
            editor.putString("widget_${widgetId}_display", display)
            
            if (type == "friend" && !friendId.isNullOrEmpty() && !friendName.isNullOrEmpty()) {
                editor.putString("widget_${widgetId}_friend_id", friendId)
                editor.putString("widget_${widgetId}_friend_name", friendName)
            }
            
            editor.apply()
            
            // Update the widgets
            val appWidgetManager = AppWidgetManager.getInstance(context)
            
            // Determine if this is a small or large widget and update accordingly
            if (widgetId.toString().contains("4x2")) {
                // Update large widget
                updateLargeWidget(context, appWidgetManager, widgetId)
            } else {
                // Update small widget
                updateSmallWidget(context, appWidgetManager, widgetId)
            }
            
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to configure widget: ${e.message}")
        }
    }
} 