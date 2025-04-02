package com.example.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.Color
import android.view.View
import android.widget.RemoteViews

class SmallWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateSmallWidget(context, appWidgetManager, appWidgetId)
        }
    }
}

internal fun updateSmallWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
    val widgetType = prefs.getString("widget_${appWidgetId}_type", "own") // "own" or "friend"
    val displayMode = prefs.getString("widget_${appWidgetId}_display", "color") // "color" or "word"
    
    val views = RemoteViews(context.packageName, R.layout.small_widget)
    
    if (widgetType == "own") {
        // Display user's own mood
        if (displayMode == "color") {
            // Display color mixer
            val moodColor = prefs.getString("user_mood_color", "#3498db") ?: "#3498db"
            views.setInt(R.id.mood_color_view, "setBackgroundColor", Color.parseColor(moodColor))
            views.setViewVisibility(R.id.mood_color_view, View.VISIBLE)
            views.setViewVisibility(R.id.mood_text_view, View.GONE)
            views.setTextViewText(R.id.widget_title, "My Mood")
        } else {
            // Display word cloud
            val moodText = prefs.getString("user_mood_text", "Calm") ?: "Calm"
            views.setTextViewText(R.id.mood_text_view, moodText)
            views.setViewVisibility(R.id.mood_color_view, View.GONE)
            views.setViewVisibility(R.id.mood_text_view, View.VISIBLE)
            views.setTextViewText(R.id.widget_title, "My Mood")
        }
    } else {
        // Display friend's mood
        val friendId = prefs.getString("widget_${appWidgetId}_friend_id", "")
        val friendName = prefs.getString("widget_${appWidgetId}_friend_name", "Friend")
        
        if (displayMode == "color") {
            // Display color mixer
            val moodColor = prefs.getString("friend_${friendId}_mood_color", "#e74c3c") ?: "#e74c3c"
            views.setInt(R.id.mood_color_view, "setBackgroundColor", Color.parseColor(moodColor))
            views.setViewVisibility(R.id.mood_color_view, View.VISIBLE)
            views.setViewVisibility(R.id.mood_text_view, View.GONE)
            views.setTextViewText(R.id.widget_title, "${friendName}'s Mood")
        } else {
            // Display word cloud
            val moodText = prefs.getString("friend_${friendId}_mood_text", "Happy") ?: "Happy"
            views.setTextViewText(R.id.mood_text_view, moodText)
            views.setViewVisibility(R.id.mood_color_view, View.GONE)
            views.setViewVisibility(R.id.mood_text_view, View.VISIBLE)
            views.setTextViewText(R.id.widget_title, "${friendName}'s Mood")
        }
    }
    
    // Setup click intent to open edit screen
    val intent = Intent(context, context.packageManager.getLaunchIntentForPackage(context.packageName)?.component?.className?.let { 
        Class.forName(it) 
    }).apply {
        putExtra("screen", "edit_widget")
        putExtra("widgetId", appWidgetId)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
    }
    
    val pendingIntent = PendingIntent.getActivity(
        context,
        appWidgetId,
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    
    views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)
    
    appWidgetManager.updateAppWidget(appWidgetId, views)
} 