package com.moodsync.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log

/**
 * Base class for all widget providers in the app.
 * Provides common functionality for all widgets.
 */
abstract class BaseWidgetProvider : AppWidgetProvider() {
    companion object {
        const val TAG = "BaseWidgetProvider"
    }

    protected fun setClickIntent(context: Context, appWidgetId: Int, widgetType: String): PendingIntent {
        // Save widget type for later use
        val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
        prefs.edit().putString("widget_${appWidgetId}_type", widgetType).apply()
        
        // Create intent to open MainActivity with config info
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("openWidgetConfig", true)
            putExtra("widgetId", appWidgetId)
            putExtra("widgetType", widgetType)
            
            // Use a unique action to avoid intent reuse issues
            action = "com.moodsync.app.WIDGET_CONFIG_${appWidgetId}"
        }
        
        return PendingIntent.getActivity(
            context,
            appWidgetId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        
        when (intent.action) {
            "com.moodsync.app.WIDGET_UPDATE" -> {
                // Handle the custom widget update action
                val userId = intent.getStringExtra("userId") ?: ""
                Log.d(TAG, "Received WIDGET_UPDATE broadcast for user: $userId")
                
                val appWidgetManager = AppWidgetManager.getInstance(context)
                val appWidgetIds = appWidgetManager.getAppWidgetIds(intent.component)
                
                // Update all instances of this widget
                if (appWidgetIds != null && appWidgetIds.isNotEmpty()) {
                    onUpdate(context, appWidgetManager, appWidgetIds)
                }
            }
        }
    }

    override fun onAppWidgetOptionsChanged(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int,
        newOptions: Bundle
    ) {
        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions)
        // Update the widget when its size changes
        val appWidgetIds = intArrayOf(appWidgetId)
        onUpdate(context, appWidgetManager, appWidgetIds)
    }
} 