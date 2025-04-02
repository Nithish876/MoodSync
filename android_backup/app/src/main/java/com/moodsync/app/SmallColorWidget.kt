package com.moodsync.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.text.Html
import android.util.Log
import android.view.View
import android.widget.RemoteViews
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

class SmallColorWidget : AppWidgetProvider() {
    companion object {
        private const val TAG = "SmallColorWidget"
        private const val ERROR_COLOR = "#FF5252" // Red for error states
        private const val DEFAULT_COLOR = "#3498db" // Default blue
    }
    
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        Log.d(TAG, "onUpdate called for ${appWidgetIds.size} widgets")
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        try {
            Log.d(TAG, "Updating small color widget ID: $appWidgetId")
            
            val views = RemoteViews(context.packageName, R.layout.small_color_widget)
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
                    var narrative: String? = null
                    
                    // 1. First try simplified small widget text if available
                    val directSmallText = prefs.getString("user_small_color_widget_text", null)
                    if (!directSmallText.isNullOrEmpty()) {
                        try {
                            val json = JSONObject(directSmallText)
                            narrative = json.optString("smallWidgetText") 
                                     ?: json.optString("narrative") 
                                     ?: json.optString("summary")
                            
                            if (!narrative.isNullOrEmpty()) {
                                Log.d(TAG, "Using direct small color widget text: $narrative")
                            }
                        } catch (e: Exception) {
                            // If it's not JSON, use the string directly
                            narrative = directSmallText
                            Log.d(TAG, "Using direct non-JSON text: $narrative")
                        }
                    }
                    
                    // 2. Fall back to standard color mixer narrative
                    if (narrative.isNullOrEmpty()) {
                        narrative = prefs.getString("user_mood_narrative", null)
                        Log.d(TAG, "Using color mixer narrative: ${narrative ?: "null"}")
                    }
                    
                    // 3. Try word cloud text as a last resort
                    if (narrative.isNullOrEmpty()) {
                        val rawWordText = prefs.getString("user_word_cloud_text", null)
                        val wordText = parseWordCloudText(rawWordText)
                        if (!wordText.isNullOrEmpty()) {
                            narrative = "Feeling: $wordText"
                            Log.d(TAG, "Using word cloud text as fallback: $narrative")
                        }
                    }
                    
                    Log.d(TAG, "Final narrative: ${narrative ?: "null"}")
                    
                    if (!narrative.isNullOrEmpty()) {
                        views.setTextViewText(R.id.widget_content, narrative)
                        
                        // Set updated date
                        val timestamp = prefs.getLong("user_color_mix_updated", System.currentTimeMillis())
                        views.setTextViewText(R.id.widget_date, dateFormat.format(Date(timestamp)))
                    } else {
                        views.setTextViewText(R.id.widget_content, "Add colors to reflect your mood")
                        views.setTextViewText(R.id.widget_date, dateFormat.format(Date()))
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error loading user mood: ${e.message}", e)
                    views.setTextViewText(R.id.widget_content, "Tap to fix widget")
                    views.setTextColor(R.id.widget_content, Color.parseColor(ERROR_COLOR))
                    views.setTextViewText(R.id.widget_date, "Error")
                }
            } else if (!friendId.isNullOrEmpty()) {
                try {
                // Show friend's mood
                    val displayName = friendName ?: "Friend"
                    views.setTextViewText(R.id.widget_title, "$displayName's Mood")
                    
                    // Multi-source approach for friend data too
                    var friendNarrative: String? = null
                    
                    // 1. Try direct data for small widget if available
                    val directFriendText = prefs.getString("friend_${friendId}_small_color_widget_text", null)
                    if (!directFriendText.isNullOrEmpty()) {
                        try {
                            val json = JSONObject(directFriendText)
                            friendNarrative = json.optString("smallWidgetText")
                                           ?: json.optString("narrative")
                                           ?: json.optString("summary")
                        } catch (e: Exception) {
                            // If it's not JSON, use the string directly
                            friendNarrative = directFriendText
                        }
                    }
                    
                    // 2. Fall back to standard color mixer narrative
                    if (friendNarrative.isNullOrEmpty()) {
                        friendNarrative = prefs.getString("friend_${friendId}_mood_narrative", null)
                    }
                    
                    // 3. Try word cloud text as a last resort
                    if (friendNarrative.isNullOrEmpty()) {
                        val rawWordText = prefs.getString("friend_${friendId}_word_cloud_text", null)
                        val wordText = parseWordCloudText(rawWordText)
                        if (!wordText.isNullOrEmpty()) {
                            friendNarrative = "Feeling: $wordText"
                        }
                    }
                    
                    Log.d(TAG, "Friend narrative: ${friendNarrative ?: "null"}")
                    
                    if (!friendNarrative.isNullOrEmpty()) {
                        views.setTextViewText(R.id.widget_content, friendNarrative)
                        
                        // Set updated date - try multiple sources
                        val timestamp = prefs.getLong("friend_${friendId}_color_mix_updated", 
                                        prefs.getLong("friend_${friendId}_word_cloud_updated", 
                                        prefs.getLong("friend_${friendId}_updated", System.currentTimeMillis())))
                        views.setTextViewText(R.id.widget_date, dateFormat.format(Date(timestamp)))
                    } else {
                        views.setTextViewText(R.id.widget_content, "$displayName hasn't shared a mood yet")
                        views.setTextViewText(R.id.widget_date, dateFormat.format(Date()))
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error loading friend mood: ${e.message}", e)
                    views.setTextViewText(R.id.widget_content, "Tap to fix widget")
                    views.setTextColor(R.id.widget_content, Color.parseColor(ERROR_COLOR))
                    views.setTextViewText(R.id.widget_date, "Error")
                }
            } else {
                // No valid configuration
                views.setTextViewText(R.id.widget_content, "Tap to configure widget")
                views.setTextColor(R.id.widget_content, Color.parseColor(ERROR_COLOR))
                views.setTextViewText(R.id.widget_date, "Error")
            }
            
            // Set the date
            views.setTextViewText(R.id.widget_date, dateFormat.format(Date()))
            
            // Set click intent to open app
            setClickIntent(context, views, appWidgetId)
            
            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
            
        } catch (e: Exception) {
            Log.e(TAG, "Error updating widget: ${e.message}", e)
            
            // Create an error widget as fallback
            try {
                val errorViews = RemoteViews(context.packageName, R.layout.small_color_widget)
                errorViews.setTextViewText(R.id.widget_title, "My Mood")
                errorViews.setTextViewText(R.id.widget_content, "Widget Error: ${e.message}")
                
                val dateFormatter = SimpleDateFormat("MMM d", Locale.getDefault())
                val formattedDate = dateFormatter.format(Date(System.currentTimeMillis()))
                errorViews.setTextViewText(R.id.widget_date, formattedDate)
                
                // Set click intent to open app
                setClickIntent(context, errorViews, appWidgetId)
                
                // Update the widget with error state
                appWidgetManager.updateAppWidget(appWidgetId, errorViews)
            } catch (fatal: Exception) {
                Log.e(TAG, "Fatal error creating error widget: ${fatal.message}", fatal)
            }
        }
    }
    
    /**
     * Generate mood summary similar to the React Native code in ColorMixer.tsx
     */
    private fun generateMoodSummary(moods: JSONArray): String {
        try {
            if (moods.length() == 0) return "No mood data available"
            
            if (moods.length() == 1) {
                val mood = moods.getJSONObject(0)
                val emoji = mood.optString("emoji", "")
                val name = mood.optString("name", "")
                return "Feeling $name $emoji"
            }
            
            // Get sorted moods (assuming they're already sorted by percentage)
            val topMoods = mutableListOf<Pair<String, String>>()
            
            // Extract top 3 moods (or fewer if not available)
            val count = Math.min(3, moods.length())
            for (i in 0 until count) {
                val mood = moods.getJSONObject(i)
                val emoji = mood.optString("emoji", "")
                val name = mood.optString("name", "")
                topMoods.add(Pair(name, emoji))
            }
            
            // Generate summary text like in ColorMixer.tsx
            return when (topMoods.size) {
                1 -> "Feeling ${topMoods[0].first} ${topMoods[0].second}"
                2 -> "A mix of ${topMoods[0].first} ${topMoods[0].second} and ${topMoods[1].first} ${topMoods[1].second}"
                else -> "Mostly ${topMoods[0].first} ${topMoods[0].second} with some ${topMoods[1].first} ${topMoods[1].second} and a hint of ${topMoods[2].first} ${topMoods[2].second}"
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error generating mood summary: ${e.message}")
            return "Mood data available"
        }
    }
    
    /**
     * Generate mood summary from component arrays
     */
    private fun generateMoodSummaryFromComponents(emojis: JSONArray, names: JSONArray, percentages: JSONArray): String {
        try {
            // Create a list of mood data
            val moods = mutableListOf<Triple<String, String, Int>>()
            
            // Extract mood data from arrays
            for (i in 0 until Math.min(Math.min(emojis.length(), names.length()), percentages.length())) {
                val emoji = emojis.getString(i)
                val name = names.getString(i)
                val percentage = percentages.getInt(i)
                moods.add(Triple(name, emoji, percentage))
            }
            
            // Sort by percentage (descending)
            moods.sortByDescending { it.third }
            
            if (moods.isEmpty()) return "No mood data available"
            
            if (moods.size == 1) {
                return "Feeling ${moods[0].first} ${moods[0].second}"
            }
            
            // Get top 3 moods (or fewer if not available)
            val topMoods = moods.take(Math.min(3, moods.size))
            
            // Generate summary text like in ColorMixer.tsx
            return when (topMoods.size) {
                1 -> "Feeling ${topMoods[0].first} ${topMoods[0].second}"
                2 -> "A mix of ${topMoods[0].first} ${topMoods[0].second} and ${topMoods[1].first} ${topMoods[1].second}"
                else -> "Mostly ${topMoods[0].first} ${topMoods[0].second} with some ${topMoods[1].first} ${topMoods[1].second} and a hint of ${topMoods[2].first} ${topMoods[2].second}"
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error generating mood summary from components: ${e.message}")
            return "Mood data available"
        }
    }
    
    private fun setClickIntent(context: Context, views: RemoteViews, appWidgetId: Int) {
        val intent = Intent(context, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            putExtra("widgetId", appWidgetId)
            putExtra("openWidgetConfig", true)  
            putExtra("widgetType", "small_color") 
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
        val editor = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE).edit()
        for (appWidgetId in appWidgetIds) {
            editor.remove("widget_${appWidgetId}_is_own_mood")
            editor.remove("widget_${appWidgetId}_friend_id")
            editor.remove("widget_${appWidgetId}_friend_name")
        }
        editor.apply()
    }

    // Helper function to parse word cloud text from JSON string
    private fun parseWordCloudText(rawWordCloudText: String?): String? {
        if (rawWordCloudText.isNullOrEmpty()) {
            return null
        }
        
        try {
            val wordCloudJson = JSONObject(rawWordCloudText)
            
            // First check if there's a pre-parsed "text" field
            if (wordCloudJson.has("text")) {
                return wordCloudJson.getString("text")
            }
            
            // Otherwise check for words array
            if (wordCloudJson.has("words")) {
                val wordsArray = wordCloudJson.getJSONArray("words")
                if (wordsArray.length() > 0) {
                    // Extract the top 3 words with highest values
                    val topWords = mutableListOf<Pair<String, Double>>()
                    
                    for (i in 0 until wordsArray.length()) {
                        val wordObj = wordsArray.getJSONObject(i)
                        val text = wordObj.getString("text")
                        val value = wordObj.getDouble("value")
                        topWords.add(Pair(text, value))
                    }
                    
                    // Sort by value in descending order
                    topWords.sortByDescending { it.second }
                    
                    // Take top 3 or fewer
                    val wordCount = minOf(3, topWords.size)
                    val result = topWords.take(wordCount).joinToString(", ") { it.first }
                    
                    return result
                }
            }
            
            // No valid format found
            return null
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing word cloud text: ${e.message}", e)
            return null
        }
    }
} 