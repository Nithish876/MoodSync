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

class LargeWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateLargeWidget(context, appWidgetManager, appWidgetId)
        }
    }
}

internal fun updateLargeWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
    
    val views = RemoteViews(context.packageName, R.layout.large_widget)
    
    // Setup the left side (user's mood)
    val userMoodColor = prefs.getString("user_mood_color", "#3498db") ?: "#3498db"
    val userMoodText = prefs.getString("user_mood_text", "Calm") ?: "Calm"
    
    views.setInt(R.id.user_mood_color_view, "setBackgroundColor", Color.parseColor(userMoodColor))
    views.setTextViewText(R.id.user_mood_text_view, userMoodText)
    views.setTextViewText(R.id.user_title, "My Mood")
    
    // Setup the right side (friend's mood)
    val friendId = prefs.getString("large_widget_${appWidgetId}_friend_id", "")
    val friendName = prefs.getString("large_widget_${appWidgetId}_friend_name", "Friend") ?: "Friend"
    val friendMoodColor = prefs.getString("friend_${friendId}_mood_color", "#e74c3c") ?: "#e74c3c"
    val friendMoodText = prefs.getString("friend_${friendId}_mood_text", "Happy") ?: "Happy"
    
    views.setInt(R.id.friend_mood_color_view, "setBackgroundColor", Color.parseColor(friendMoodColor))
    views.setTextViewText(R.id.friend_mood_text_view, friendMoodText)
    views.setTextViewText(R.id.friend_title, "${friendName}'s Mood")
    
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