package com.moodsync.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.view.View
import android.widget.RemoteViews
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import android.util.Log
import org.json.JSONArray

class LargeColorWidget : AppWidgetProvider() {
    companion object {
        private const val TAG = "LargeColorWidget"
        private const val ERROR_COLOR = "#FF5252" // Error color
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
            Log.d(TAG, "Updating large color widget ID: $appWidgetId")
            
            val views = RemoteViews(context.packageName, R.layout.large_color_widget)
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            
            // Get widget configuration
            val isOwnMood = prefs.getBoolean("widget_${appWidgetId}_is_own_mood", true)
            val friendId = prefs.getString("widget_${appWidgetId}_friend_id", "")
            val friendName = prefs.getString("widget_${appWidgetId}_friend_name", "")
            
            // Initialize variables
            var moodSummary = "Tap to update your mood"
            var moodColor = DEFAULT_COLOR
            var timestamp = System.currentTimeMillis()
            var hasError = false
            
            Log.d(TAG, "Widget $appWidgetId configured for: isOwnMood=$isOwnMood, friendId=$friendId, friendName=$friendName")
            
            if (isOwnMood) {
                // Show user's mood
                views.setTextViewText(R.id.widget_title, "My Mood")
                
                // Try to get directly stored narrative first (faster)
                val userNarrative = prefs.getString("user_mood_narrative", null)
                if (!userNarrative.isNullOrEmpty()) {
                    // We have a narrative, use it
                    moodSummary = userNarrative
                    Log.d(TAG, "Using stored narrative: $userNarrative")
                    
                    // Get the corresponding timestamp
                    timestamp = prefs.getLong("user_color_mix_updated", System.currentTimeMillis())
                    
                    // Get the cached color if available
                    moodColor = prefs.getString("user_mood_color", DEFAULT_COLOR) ?: DEFAULT_COLOR
                } else {
                    // Fall back to parsing the full color mix data
                    val colorMixJson = prefs.getString("user_color_mix_data", null)
                    if (colorMixJson != null && colorMixJson.isNotEmpty()) {
                        Log.d(TAG, "Parsing user color mix data")
                        try {
                            val colorMix = JSONObject(colorMixJson)
                            
                            // First try to get narrative directly
                            var summary = colorMix.optString("narrative", "")
                            
                            // If no narrative, try summaryObject.narrative
                            if (summary.isEmpty()) {
                                val summaryObj = colorMix.optJSONObject("summaryObject")
                                if (summaryObj != null) {
                                    if (summaryObj.has("narrative")) {
                                        summary = summaryObj.getString("narrative")
                                    } else {
                                        summary = summaryObj.optString("text", "")
                                    }
                                }
                            }
                            
                            if (summary.isNotEmpty()) {
                                moodSummary = summary
                                
                                // Save the narrative for quicker access next time
                                prefs.edit().putString("user_mood_narrative", summary).apply()
                            }
                            
                            // Get the dominant color
                            try {
                                val moods = colorMix.optJSONArray("moods")
                                if (moods != null && moods.length() > 0) {
                                    val topMood = moods.getJSONObject(0)
                                    moodColor = topMood.optString("color", moodColor)
                                    
                                    // Save the color for quicker access next time
                                    prefs.edit().putString("user_mood_color", moodColor).apply()
                                }
                            } catch (e: Exception) {
                                Log.e(TAG, "Error parsing moods: ${e.message}")
                            }
                            
                            // Get timestamp
                            timestamp = colorMix.optLong("timestamp", System.currentTimeMillis())
                        } catch (e: Exception) {
                            Log.e(TAG, "Error parsing user color mix: ${e.message}", e)
                            hasError = true
                            moodSummary = "Error: Invalid mood data"
                            moodColor = ERROR_COLOR
                        }
                    } else {
                        moodSummary = "Tap to update your mood"
                    }
                }
            } else if (!friendId.isNullOrEmpty()) {
                // Show friend's mood
                val friendDisplayName = friendName ?: "Friend"
                views.setTextViewText(R.id.widget_title, "$friendDisplayName's Mood")
                
                // Try to get friend mood narrative data first (faster)
                val friendNarrative = prefs.getString("friend_${friendId}_mood_narrative", null)
                if (!friendNarrative.isNullOrEmpty()) {
                    // We have a narrative summary, use it directly
                    moodSummary = friendNarrative
                    Log.d(TAG, "Found friend mood narrative: $friendNarrative")
                    
                    // Get the corresponding timestamp
                    timestamp = prefs.getLong("friend_${friendId}_color_mix_updated", System.currentTimeMillis())
                    
                    // Try to get the main color
                    moodColor = prefs.getString("friend_${friendId}_mood_color", DEFAULT_COLOR) ?: DEFAULT_COLOR
                } else {
                    // Fall back to parsing the full color mix data
                    val friendColorMixJson = prefs.getString("friend_${friendId}_color_mix_data", null)
                    if (friendColorMixJson != null && friendColorMixJson.isNotEmpty()) {
                        Log.d(TAG, "Parsing friend color mix data: $friendColorMixJson")
                        try {
                            val friendColorMix = JSONObject(friendColorMixJson)
                            
                            // Try to get narrative directly - this matches the React Native object
                            var summary = friendColorMix.optString("narrative", "")
                            
                            // If no narrative, try to extract from formatted data
                            if (summary.isEmpty()) {
                                // Try to reconstruct summary from moods data
                                val moods = friendColorMix.optJSONArray("moods")
                                val emojis = friendColorMix.optJSONArray("emojis")
                                val names = friendColorMix.optJSONArray("names")
                                val percentages = friendColorMix.optJSONArray("percentages")
                                
                                if (moods != null && moods.length() > 0) {
                                    // Try to generate using moods array (full data)
                                    summary = generateMoodSummary(moods)
                                } else if (emojis != null && names != null && percentages != null) {
                                    // Try to generate from formatted components
                                    summary = generateMoodSummaryFromComponents(emojis, names, percentages)
                                }
                            }
                            
                            if (summary.isNotEmpty()) {
                                moodSummary = summary
                                
                                // Save the narrative for quicker access next time
                                prefs.edit().putString("friend_${friendId}_mood_narrative", summary).apply()
                            } else {
                                moodSummary = "$friendDisplayName hasn't updated their mood lately"
                            }
                            
                            // Get main color
                            try {
                                // Try to get color from moods array first
                                val moods = friendColorMix.optJSONArray("moods")
                                if (moods != null && moods.length() > 0) {
                                    val topMood = moods.getJSONObject(0)
                                    moodColor = topMood.optString("color", DEFAULT_COLOR)
                                }
                                
                                // Save the color for quicker access next time
                                prefs.edit().putString("friend_${friendId}_mood_color", moodColor).apply()
                            } catch (e: Exception) {
                                Log.e(TAG, "Error parsing friend's mood color: ${e.message}")
                            }
                            
                            // Get timestamp
                            timestamp = friendColorMix.optLong("timestamp", System.currentTimeMillis())
                            
                        } catch (e: Exception) {
                            Log.e(TAG, "Error parsing friend color mix: ${e.message}", e)
                            hasError = true
                            moodSummary = "Error accessing friend's mood"
                            moodColor = ERROR_COLOR
                        }
                    } else {
                        moodSummary = "$friendDisplayName hasn't shared their mood yet"
                    }
                }
            } else {
                // No valid configuration
                moodSummary = "Tap to configure widget"
                hasError = true
            }
            
            // Format the date
            val dateFormatter = SimpleDateFormat("MMM d", Locale.getDefault())
            val formattedDate = dateFormatter.format(Date(timestamp))
            
            // Set the text and color for the main display
            if (hasError) {
                views.setTextViewText(R.id.mood_summary_text, moodSummary)
                views.setInt(R.id.glass_ball, "setColorFilter", Color.parseColor(ERROR_COLOR))
                views.setViewVisibility(R.id.glass_ball_container, View.VISIBLE)
                views.setViewVisibility(R.id.empty_state_text, View.GONE)
            } else if (moodSummary.isEmpty() || moodSummary == "Tap to update your mood" || 
                     moodSummary.contains("hasn't shared") || moodSummary.contains("hasn't updated")) {
                // Show empty state with message
                views.setViewVisibility(R.id.glass_ball_container, View.GONE)
                views.setViewVisibility(R.id.empty_state_text, View.VISIBLE)
                views.setTextViewText(R.id.empty_state_text, moodSummary)
            } else {
                // Show mood with colored ball
                views.setViewVisibility(R.id.glass_ball_container, View.VISIBLE)
                views.setViewVisibility(R.id.empty_state_text, View.GONE)
                views.setTextViewText(R.id.mood_summary_text, moodSummary)
                
                try {
                    views.setInt(R.id.glass_ball, "setColorFilter", Color.parseColor(moodColor))
                    // Log what text we're setting for debugging
                    Log.d(TAG, "Setting mood summary text: '$moodSummary'")
                } catch (e: Exception) {
                    Log.e(TAG, "Error setting color: $moodColor - ${e.message}")
                    views.setInt(R.id.glass_ball, "setColorFilter", Color.parseColor(DEFAULT_COLOR))
                }
            }
            
            // Set the date
            views.setTextViewText(R.id.date_view, formattedDate)
            
            // Set click intent
            setClickIntent(context, views, appWidgetId)
            
            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
            Log.d(TAG, "Large color widget $appWidgetId updated successfully with: $moodSummary")
        } catch (e: Exception) {
            Log.e(TAG, "Critical error updating large color widget: ${e.message}", e)
            
            // Create emergency fallback view
            try {
                val errorViews = RemoteViews(context.packageName, R.layout.large_color_widget)
                errorViews.setTextViewText(R.id.widget_title, "Widget Error")
                errorViews.setViewVisibility(R.id.glass_ball_container, View.GONE)
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
    
    /**
     * Generate a mood summary from a JSONArray of mood objects
     */
    private fun generateMoodSummary(moods: JSONArray): String {
        try {
            if (moods.length() == 0) return "No mood data"
            
            // Format: [{"id":"uuid","emoji":"😀","color":"#RRGGBB","percentage":30,"volume":1,"name":"Happy"}]
            val moodList = mutableListOf<Triple<String, String, Int>>()
            
            for (i in 0 until moods.length()) {
                val mood = moods.getJSONObject(i)
                val name = mood.optString("name", "Unknown")
                val emoji = mood.optString("emoji", "")
                val percentage = mood.optInt("percentage", 0)
                
                moodList.add(Triple(name, emoji, percentage))
            }
            
            // Sort by percentage (descending)
            moodList.sortByDescending { it.third }
            
            if (moodList.isEmpty()) return "No mood data"
            
            if (moodList.size == 1) {
                return "Feeling ${moodList[0].first} ${moodList[0].second}"
            }
            
            // Get top 3 moods (or fewer if not available)
            val topMoods = moodList.take(Math.min(3, moodList.size))
            
            // Generate summary text in the specified format
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
     * Generate a mood summary from separate JSON arrays for emoji, name, and percentage
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
            putExtra("widgetType", "large_color") 
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