package com.moodsync.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.util.Log
import android.view.View
import android.widget.RemoteViews
import java.text.SimpleDateFormat
import java.util.*
import org.json.JSONObject

class LargeWordWidget : AppWidgetProvider() {
    companion object {
        private const val TAG = "LargeWordWidget"
        private const val ERROR_COLOR = "#FF5252" // Red for error states
    }
    
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        Log.d(TAG, "onUpdate called for ${appWidgetIds.size} widgets")
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        try {
            Log.d(TAG, "Updating large word widget ID: $appWidgetId")
            
            val views = RemoteViews(context.packageName, R.layout.large_word_widget)
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            
            // Get widget type (my mood or friend's mood)
            val isOwnMood = prefs.getBoolean("widget_${appWidgetId}_is_own_mood", true)
            val dateFormat = SimpleDateFormat("MMM d", Locale.getDefault())
            
            if (isOwnMood) {
                // Display my mood
                views.setTextViewText(R.id.widget_title, "My Mood")
                
                // Get mood text for the thought bubble
                val rawMoodText = prefs.getString("user_word_cloud_text", null)
                val moodText = parseWordCloudText(rawMoodText)
                val hasWordData = moodText != null && moodText.isNotEmpty()
                
                if (hasWordData) {
                    views.setViewVisibility(R.id.thought_bubble_container, View.VISIBLE)
                    views.setViewVisibility(R.id.empty_state_text, View.GONE)
                    views.setTextViewText(R.id.mood_text_view, moodText)
                    
                    val timestamp = prefs.getLong("user_word_cloud_updated", System.currentTimeMillis())
                    val dateStr = dateFormat.format(Date(timestamp))
                    views.setTextViewText(R.id.date_view, dateStr)
                } else {
                    // Show empty state with clearer message
                    views.setViewVisibility(R.id.thought_bubble_container, View.GONE)
                    views.setViewVisibility(R.id.empty_state_text, View.VISIBLE)
                    views.setTextViewText(R.id.empty_state_text, "Tap to add your thoughts")
                    views.setTextViewText(R.id.date_view, dateFormat.format(Date()))
                }
            } else {
                // Display friend's mood
                val friendId = prefs.getString("widget_${appWidgetId}_friend_id", "")
                val friendName = prefs.getString("widget_${appWidgetId}_friend_name", "Friend") ?: "Friend"
                
                if (friendId.isNullOrEmpty()) {
                    // Handle case where no friend is selected
                    views.setTextViewText(R.id.widget_title, "Friend's Mood")
                    views.setViewVisibility(R.id.thought_bubble_container, View.GONE)
                    views.setViewVisibility(R.id.empty_state_text, View.VISIBLE)
                    views.setTextViewText(R.id.empty_state_text, "Tap to select a friend")
                    views.setTextViewText(R.id.date_view, dateFormat.format(Date()))
                } else {
                    views.setTextViewText(R.id.widget_title, "$friendName's Mood")
                    
                    // Get friend's mood text with failover to stored direct text
                    val rawMoodText = prefs.getString("friend_${friendId}_word_cloud_text", null)
                    val moodText = parseWordCloudText(rawMoodText)
                        ?: prefs.getString("friend_${friendId}_summary", "")
                    
                    val hasFriendData = !moodText.isNullOrEmpty()
                    
                    if (hasFriendData) {
                        views.setViewVisibility(R.id.thought_bubble_container, View.VISIBLE)
                        views.setViewVisibility(R.id.empty_state_text, View.GONE)
                        views.setTextViewText(R.id.mood_text_view, moodText)
                        
                        val timestamp = prefs.getLong("friend_${friendId}_word_cloud_updated", System.currentTimeMillis())
                        val dateStr = dateFormat.format(Date(timestamp))
                        views.setTextViewText(R.id.date_view, dateStr)
                    } else {
                        // Show empty state for friend
                        views.setViewVisibility(R.id.thought_bubble_container, View.GONE)
                        views.setViewVisibility(R.id.empty_state_text, View.VISIBLE)
                        views.setTextViewText(R.id.empty_state_text, "Friend hasn't shared thoughts yet")
                        views.setTextViewText(R.id.date_view, dateFormat.format(Date()))
                    }
                }
            }
            
            // Set click intent
            setClickIntent(context, views, appWidgetId)
            
            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
            Log.d(TAG, "Large word widget $appWidgetId updated successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Critical error updating large word widget: ${e.message}", e)
            
            // Create emergency fallback view
            try {
                val errorViews = RemoteViews(context.packageName, R.layout.large_word_widget)
                errorViews.setTextViewText(R.id.widget_title, "Widget Error")
                errorViews.setViewVisibility(R.id.thought_bubble_container, View.GONE)
                errorViews.setViewVisibility(R.id.empty_state_text, View.VISIBLE)
                errorViews.setTextViewText(R.id.empty_state_text, "Tap to fix widget")
                errorViews.setTextColor(R.id.empty_state_text, Color.parseColor(ERROR_COLOR))
                errorViews.setTextViewText(R.id.date_view, "Error")
                
                // Set click intent to open app
                setClickIntent(context, errorViews, appWidgetId)
                
                // Update the widget with error state
                appWidgetManager.updateAppWidget(appWidgetId, errorViews)
            } catch (fatal: Exception) {
                Log.e(TAG, "Fatal error creating error widget: ${fatal.message}", fatal)
            }
        }
    }
    
    private fun setClickIntent(context: Context, views: RemoteViews, appWidgetId: Int) {
        val intent = Intent(context, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            putExtra("widgetId", appWidgetId)
            putExtra("openWidgetConfig", true)
            putExtra("widgetType", "large_word")
            action = "com.moodsync.app.CONFIGURE_WIDGET"
        }
        
        val pendingIntent = PendingIntent.getActivity(
            context,
            appWidgetId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)
    }
    
    override fun onDeleted(context: Context, appWidgetIds: IntArray) {
        // Clean up preferences when widgets are removed
        val editor = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE).edit()
        for (appWidgetId in appWidgetIds) {
            editor.remove("widget_${appWidgetId}_is_own_mood")
            editor.remove("widget_${appWidgetId}_friend_id")
            editor.remove("widget_${appWidgetId}_friend_name")
        }
        editor.apply()
    }

    // Add this new helper method to parse and extract the words
    private fun parseWordCloudText(rawText: String?): String? {
        if (rawText.isNullOrEmpty()) return null
        
        try {
            // Try to parse as JSON
            if (rawText.trim().startsWith("{")) {
                val json = JSONObject(rawText)
                
                // Try to extract title and words array
                val title = json.optString("title", "")
                val wordsArray = json.optJSONArray("words")
                
                if (wordsArray != null && wordsArray.length() > 0) {
                    // Build a list of just the text values
                    val wordsList = mutableListOf<String>()
                    
                    for (i in 0 until wordsArray.length()) {
                        val wordObj = wordsArray.optJSONObject(i)
                        val text = wordObj?.optString("text", "")
                        if (!text.isNullOrEmpty()) {
                            wordsList.add(text)
                        }
                    }
                    
                    // Format: Title followed by the words
                    return if (title.isNotEmpty()) {
                        "$title\n\n${wordsList.joinToString(", ")}"
                    } else {
                        wordsList.joinToString(", ")
                    }
                }
                
                // If we couldn't extract words, check for "text" property
                val text = json.optString("text", "")
                if (text.isNotEmpty()) return text
            }
            
            // If not JSON or parsing failed, just return the raw text
            return rawText
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing word cloud text: ${e.message}")
            // If JSON parsing fails, return the raw text
            return rawText
        }
    }
} 