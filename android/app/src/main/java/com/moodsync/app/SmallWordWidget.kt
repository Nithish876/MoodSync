package com.moodsync.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.util.Log
import android.widget.RemoteViews
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

class SmallWordWidget : AppWidgetProvider() {
    companion object {
        private const val TAG = "SmallWordWidget"
        private const val ERROR_COLOR = "#FF5252" // Red for error states
    }
    
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        try {
            Log.d(TAG, "onUpdate called for ${appWidgetIds.size} widgets")
            for (appWidgetId in appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Critical error in onUpdate: ${e.message}", e)
        }
    }

    private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        try {
            Log.d(TAG, "Updating small word widget ID: $appWidgetId")
            
            val views = RemoteViews(context.packageName, R.layout.small_word_widget)
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            
            // Get widget configuration - is this showing own mood or friend's mood?
            val isOwnMood = prefs.getBoolean("widget_${appWidgetId}_is_own_mood", true)
            val friendId = prefs.getString("widget_${appWidgetId}_friend_id", "")
            val friendName = prefs.getString("widget_${appWidgetId}_friend_name", "")
            
            // Set date
            val dateFormat = SimpleDateFormat("MMM d", Locale.getDefault())
            
            if (isOwnMood) {
                try {
                    // Show user's own mood
                    views.setTextViewText(R.id.widget_title, "My Mood")
                    
                    // Try multiple data sources in order of preference
                    var moodText: String? = null
                    
                    // 1. First try simplified direct key for small widgets
                    val directSmallText = prefs.getString("user_small_widget_text", null)
                    if (!directSmallText.isNullOrEmpty()) {
                        try {
                            val json = JSONObject(directSmallText)
                            moodText = json.optString("smallWidgetText") 
                                    ?: json.optString("narrative")
                                    ?: json.optString("text")
                            
                            if (!moodText.isNullOrEmpty()) {
                                Log.d(TAG, "Using direct small widget text: $moodText")
                            }
                        } catch (e: Exception) {
                            // If it's not JSON, use the string directly
                            moodText = directSmallText
                            Log.d(TAG, "Using direct non-JSON text: $moodText")
                        }
                    }
                    
                    // 2. Fall back to standard word cloud data
                    if (moodText.isNullOrEmpty()) {
                        val rawMoodText = prefs.getString("user_word_cloud_text", null)
                        moodText = parseWordCloudText(rawMoodText)
                        Log.d(TAG, "Parsed from word cloud: ${moodText ?: "null"}")
                    }
                    
                    // 3. Try color mix narrative as a last resort
                    if (moodText.isNullOrEmpty()) {
                        moodText = prefs.getString("user_mood_narrative", null)
                        Log.d(TAG, "Using color mix narrative: ${moodText ?: "null"}")
                    }
                    
                    Log.d(TAG, "Final user mood text: ${moodText ?: "null"}")
                    
                    if (!moodText.isNullOrEmpty()) {
                        views.setTextViewText(R.id.mood_text_view, moodText)
                        
                        // Set updated date
                        val timestamp = prefs.getLong("user_word_cloud_updated", System.currentTimeMillis())
                        views.setTextViewText(R.id.date_view, dateFormat.format(Date(timestamp)))
                    } else {
                        views.setTextViewText(R.id.mood_text_view, "Add words to describe your mood")
                        views.setTextViewText(R.id.date_view, dateFormat.format(Date()))
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error loading user mood: ${e.message}", e)
                    views.setTextViewText(R.id.mood_text_view, "Tap to fix widget")
                    views.setTextColor(R.id.mood_text_view, Color.parseColor(ERROR_COLOR))
                    views.setTextViewText(R.id.date_view, "Error")
                }
            } else if (!friendId.isNullOrEmpty()) {
                try {
                    // Show friend's mood
                    val displayName = friendName ?: "Friend"
                    views.setTextViewText(R.id.widget_title, "$displayName's Mood")
                    
                    // Multi-source approach for friend data too
                    var friendMoodText: String? = null
                    
                    // 1. Try direct friend word data if available
                    val directFriendText = prefs.getString("friend_${friendId}_small_widget_text", null)
                    if (!directFriendText.isNullOrEmpty()) {
                        try {
                            val json = JSONObject(directFriendText)
                            friendMoodText = json.optString("smallWidgetText") 
                                         ?: json.optString("narrative")
                                         ?: json.optString("text")
                        } catch (e: Exception) {
                            // If it's not JSON, use the string directly
                            friendMoodText = directFriendText
                        }
                    }
                    
                    // 2. Fall back to standard friend word cloud
                    if (friendMoodText.isNullOrEmpty()) {
                        val rawFriendMoodText = prefs.getString("friend_${friendId}_word_cloud_text", null)
                        friendMoodText = parseWordCloudText(rawFriendMoodText)
                    }
                    
                    // 3. Try friend color mix narrative as a last resort
                    if (friendMoodText.isNullOrEmpty()) {
                        friendMoodText = prefs.getString("friend_${friendId}_mood_narrative", null)
                    }
                    
                    Log.d(TAG, "Friend mood text after parsing: ${friendMoodText ?: "null"}")
                    
                    if (!friendMoodText.isNullOrEmpty()) {
                        views.setTextViewText(R.id.mood_text_view, friendMoodText)
                        
                        // Set updated date - try multiple sources
                        val timestamp = prefs.getLong("friend_${friendId}_word_cloud_updated", 
                                        prefs.getLong("friend_${friendId}_color_mix_updated", 
                                        prefs.getLong("friend_${friendId}_updated", System.currentTimeMillis())))
                        views.setTextViewText(R.id.date_view, dateFormat.format(Date(timestamp)))
                    } else {
                        views.setTextViewText(R.id.mood_text_view, "$displayName hasn't shared thoughts yet")
                        views.setTextViewText(R.id.date_view, dateFormat.format(Date()))
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error loading friend mood: ${e.message}", e)
                    views.setTextViewText(R.id.mood_text_view, "Tap to fix widget")
                    views.setTextColor(R.id.mood_text_view, Color.parseColor(ERROR_COLOR))
                    views.setTextViewText(R.id.date_view, "Error")
                }
            } else {
                // Fallback for invalid configuration
                views.setTextViewText(R.id.widget_title, "My Mood")
                views.setTextViewText(R.id.mood_text_view, "Tap to configure widget")
                views.setTextViewText(R.id.date_view, dateFormat.format(Date()))
            }
            
            // Set click intent
            setClickIntent(context, views, appWidgetId)
            
            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
            Log.d(TAG, "Small word widget $appWidgetId updated successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Error updating small word widget $appWidgetId: ${e.message}", e)
            
            // Create emergency fallback view
            try {
                val errorViews = RemoteViews(context.packageName, R.layout.small_word_widget)
                errorViews.setTextViewText(R.id.widget_title, "Widget Error")
                errorViews.setTextViewText(R.id.mood_text_view, "Tap to fix widget")
                errorViews.setTextColor(R.id.mood_text_view, Color.parseColor(ERROR_COLOR))
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
    
    // Add this helper method to parse word cloud JSON data
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
                        // For small widget, we want a more compact format
                        "$title: ${wordsList.joinToString(", ")}"
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
    
    private fun setClickIntent(context: Context, views: RemoteViews, appWidgetId: Int) {
        val intent = Intent(context, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            putExtra("widgetId", appWidgetId)
            putExtra("openWidgetConfig", true)  
            putExtra("widgetType", "small_word") 
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
} 