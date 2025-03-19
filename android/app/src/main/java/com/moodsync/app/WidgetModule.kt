package com.moodsync.app

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import org.json.JSONObject
import kotlin.math.min
import org.json.JSONException
import com.facebook.react.uimanager.ViewManager
import java.util.Collections
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.json.JSONArray

// We need two classes - one for the Module and one for the Package

// The actual module implementation
@ReactModule(name = WidgetModule.NAME)
class WidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val NAME = "WidgetModule"
        private const val TAG = "WidgetModule"
    }

    override fun getName(): String {
        return NAME
    }

    private fun getContext(): Context {
        return reactApplicationContext
    }

    @ReactMethod
    fun updateWidgets(promise: Promise) {
        try {
            val context = getContext()
            updateAllWidgets(context)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to update widgets: ${e.message}")
        }
    }

    @ReactMethod
    fun configureWidget(configJson: String, promise: Promise?) {
        try {
            val config = JSONObject(configJson)
            val widgetId = config.getInt("widgetId")
            val isOwnMood = config.getBoolean("isOwnMood")
            
            val editor = reactApplicationContext.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE).edit()
            
            // Store widget configuration in a single transaction
            editor.putBoolean("widget_${widgetId}_is_own_mood", isOwnMood)
            
            if (!isOwnMood && config.has("friendId") && config.has("friendName")) {
                val friendId = config.getString("friendId")
                val friendName = config.getString("friendName")
                editor.putString("widget_${widgetId}_friend_id", friendId)
                editor.putString("widget_${widgetId}_friend_name", friendName)
            }
            
            editor.apply()
            Log.d(TAG, "Widget $widgetId configured: isOwnMood=$isOwnMood")
            
            promise?.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error configuring widget: ${e.message}", e)
            promise?.reject("ERROR", "Failed to configure widget: ${e.message}")
        }
    }

    @ReactMethod
    fun saveWidgetData(widgetId: Int, dataType: String, data: ReadableMap, promise: Promise?) {
        try {
            Log.d("WidgetModule", "Saving data for widget $widgetId, type: $dataType")
            val context = reactApplicationContext
            val sharedPreferences = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            
            if (dataType == "small") {
                // Save small widget data
                if (data.hasKey("name")) {
                    editor.putString("widget_${widgetId}_name", data.getString("name"))
                }
                if (data.hasKey("mood")) {
                    editor.putString("widget_${widgetId}_mood", data.getString("mood"))
                }
            } else if (dataType == "large") {
                // Save large widget data
                if (data.hasKey("yourName")) {
                    editor.putString("widget_${widgetId}_your_name", data.getString("yourName"))
                }
                if (data.hasKey("yourMood")) {
                    editor.putString("widget_${widgetId}_your_mood", data.getString("yourMood"))
                }
                if (data.hasKey("friendName")) {
                    editor.putString("widget_${widgetId}_friend_name", data.getString("friendName"))
                }
                if (data.hasKey("friendMood")) {
                    editor.putString("widget_${widgetId}_friend_mood", data.getString("friendMood"))
                }
            }
            
            editor.apply()
            Log.d("WidgetModule", "Widget data saved successfully")
            
            // Update the widget to reflect changes
            updateWidget(widgetId, dataType, promise)
            
            promise?.resolve(true)
        } catch (e: Exception) {
            Log.e("WidgetModule", "Failed to save widget data: ${e.message}", e)
            promise?.reject("ERROR", "Failed to save widget data: ${e.message}")
        }
    }

    @ReactMethod
    fun syncColorMixData(userId: String, mixedColor: String, summaryJson: String, promise: Promise?) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            
            // Parse the summary data
            val summaryObject = JSONObject(summaryJson)
            
            // Create a combined data object to store
            val colorMixData = JSONObject().apply {
                put("userId", userId)
                put("mixedColor", mixedColor)
                // Ensure summary data is properly structured
                if (summaryObject.has("narrative")) {
                    // If it's already in the correct format
                    put("summaryObject", summaryObject)
                } else {
                    // If it's a simple string or different format, wrap it
                    val wrappedSummary = JSONObject().apply {
                        put("narrative", summaryObject.toString())
                    }
                    put("summaryObject", wrappedSummary)
                }
                put("timestamp", System.currentTimeMillis())
            }
            
            // Save to preferences
            prefs.edit().apply {
                putString("user_color_mix_data", colorMixData.toString())
                putLong("user_color_mix_updated", System.currentTimeMillis())
                apply()
            }
            
            // Force update widgets
            forceUpdateAllWidgets(promise)
            
            Log.d(TAG, "Color mix data synced successfully")
            
            promise?.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error syncing color mix data: ${e.message}", e)
            promise?.reject("ERROR", "Failed to sync color mix data: ${e.message}")
        }
    }

    @ReactMethod
    fun syncWordCloudData(data: String, forceUpdate: Boolean, promise: Promise?) {
        try {
            // Log what we're receiving for debugging
            logWidgetData("Syncing word cloud with data", data)
            
            val editor = reactApplicationContext.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE).edit()
            
            // Store raw data
            editor.putString("user_word_cloud_raw", data)
            
            // Parse and format data for widget display
            val cleanText = formatWordCloudForWidget(data)
            editor.putString("user_word_cloud_text", cleanText)
            
            editor.putLong("user_word_cloud_updated", System.currentTimeMillis())
            editor.apply()
            
            // Update widgets if requested
            if (forceUpdate) { 
             updateSmallWordWidgets(getContext()) 
             updateLargeWordWidgets(getContext()) 
                }
            
            Log.d(TAG, "Synced word cloud data")
            promise?.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error syncing word cloud data: ${e.message}", e)
            promise?.reject("ERROR", "Failed to sync word cloud data: ${e.message}")
        }
    }
    
    @ReactMethod
    fun syncFriendMoodData(friendId: String, friendName: String, colorHex: String, promise: Promise?) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val editor = prefs.edit()
            
            // Save friend data
            val validColorHex = if (colorHex.startsWith("#")) colorHex else "#$colorHex"
            editor.putString("friend_${friendId}_id", friendId)
            editor.putString("friend_${friendId}_name", friendName)
            editor.putString("friend_${friendId}_color_mix_data", validColorHex)
            editor.putLong("friend_${friendId}_color_mix_updated", System.currentTimeMillis())
            editor.apply()
            
            Log.d(TAG, "Synced friend color mix data for $friendName with color: $validColorHex")
            
            // Update all widgets that display friend's mood
            updateAllWidgetsOfType("friend", "color", promise)
            
            promise?.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error syncing friend color mix data: ${e.message}", e)
            promise?.reject("ERROR", "Failed to sync friend color mix data: ${e.message}")
        }
    }
    
    @ReactMethod
    fun syncFriendWordCloudData(friendId: String, friendName: String, data: String, promise: Promise?) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val editor = prefs.edit()
            
            // Log what we're receiving for debugging
            logWidgetData("Updating friend word cloud with data", data)
            
            // Store friend name
            editor.putString("friend_${friendId}_name", friendName)
            
            // Store raw data and formatted data
            editor.putString("friend_${friendId}_word_cloud_raw", data)
            
            // Parse the data to extract clean text
            val cleanText = formatWordCloudForWidget(data)
            editor.putString("friend_${friendId}_word_cloud_text", cleanText)
            
            editor.putLong("friend_${friendId}_word_cloud_updated", System.currentTimeMillis())
            editor.apply()
            
            Log.d(TAG, "Updated word cloud text for friend $friendName: $cleanText")
            
            // Update widgets showing this friend's data
            updateAllWordWidgetsForFriend(friendId, promise)
            
            promise?.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error updating friend word cloud: ${e.message}", e)
            promise?.reject("ERROR", "Failed to update friend word cloud: ${e.message}")
        }
    }
    
    private fun updateAllWidgetsOfType(type: String, display: String, promise: Promise?) {
        val context = reactApplicationContext
        val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
        val appWidgetManager = AppWidgetManager.getInstance(context)
        
        // Update small widgets
        val smallWidgetIds = appWidgetManager.getAppWidgetIds(
            ComponentName(context, SmallColorWidget::class.java))
        
        for (widgetId in smallWidgetIds) {
            val widgetType = prefs.getString("widget_${widgetId}_type", "my")
            val widgetDisplay = prefs.getString("widget_${widgetId}_display", "color")
            
            if (widgetType == type && widgetDisplay == display) {
                updateWidget(widgetId, widgetType, promise)
            }
        }
        
        // Update large widgets
        val largeWidgetIds = appWidgetManager.getAppWidgetIds(
            ComponentName(context, LargeColorWidget::class.java))
        
        for (widgetId in largeWidgetIds) {
            updateWidget(widgetId, "large", promise)
        }
    }
    
    @ReactMethod
    fun updateWidget(widgetId: Int, widgetType: String, promise: Promise?) {
        try {
            val context = reactApplicationContext
            
            if (widgetType == "small") {
                val intent = Intent(context, SmallColorWidget::class.java)
                intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, intArrayOf(widgetId))
                context.sendBroadcast(intent)
            } else if (widgetType == "large") {
                val intent = Intent(context, LargeColorWidget::class.java)
                intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, intArrayOf(widgetId))
                context.sendBroadcast(intent)
            }
            
            Log.d(TAG, "Update broadcast sent for widget $widgetId")
            
            promise?.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to update widget: ${e.message}", e)
            promise?.reject("ERROR", "Failed to update widget: ${e.message}")
        }
    }

    // Add this function to blend multiple colors
    private fun blendColors(colorHexList: List<String>): String {
        if (colorHexList.isEmpty()) return "#CCCCCC"
        if (colorHexList.size == 1) return colorHexList[0]
        
        // Parse colors to get RGB values
        var totalR = 0f
        var totalG = 0f
        var totalB = 0f
        
        for (colorHex in colorHexList) {
            try {
                val color = Color.parseColor(colorHex)
                totalR += Color.red(color)
                totalG += Color.green(color)
                totalB += Color.blue(color)
            } catch (e: Exception) {
                Log.e(TAG, "Error parsing color: $colorHex", e)
            }
        }
        
        // Average the colors
        val count = colorHexList.size.toFloat()
        val avgR = (totalR / count).toInt()
        val avgG = (totalG / count).toInt()
        val avgB = (totalB / count).toInt()
        
        // Convert back to hex
        return String.format("#%02X%02X%02X", avgR, avgG, avgB)
    }

    // Then modify your syncUserMoodData method to store a list of colors
    @ReactMethod
    fun syncUserMoodData(colorHex: String, promise: Promise?) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val editor = prefs.edit()
            
            // Get existing colors (up to 3 most recent)
            val existingColorsJson = prefs.getString("user_recent_colors", "[]")
            val gson = Gson()
            val type = object : TypeToken<ArrayList<String>>() {}.type
            val colorsList = gson.fromJson<ArrayList<String>>(existingColorsJson, type) ?: ArrayList()
            
            // Add new color at the beginning
            colorsList.add(0, colorHex)
            
            // Keep only the 3 most recent colors
            while (colorsList.size > 3) {
                colorsList.removeAt(colorsList.size - 1)
            }
            
            // Blend colors to get mixed color
            val blendedColor = blendColors(colorsList)
            
            // Save data
            editor.putString("user_recent_colors", gson.toJson(colorsList))
            editor.putString("user_color_mix", blendedColor)
            editor.putLong("user_color_mix_updated", System.currentTimeMillis())
            editor.apply()
            
            Log.d(TAG, "Synced user mood with color: $colorHex, blended: $blendedColor")
            
            // Update widgets
            updateAllWidgetsOfType("own", "color", promise)
            
            promise?.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error syncing user mood data: ${e.message}", e)
            promise?.reject("ERROR", "Failed to sync user mood: ${e.message}")
        }
    }

    @ReactMethod
    fun checkPendingWidgetConfig(promise: Promise?) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
            
            val shouldOpenConfig = prefs.getBoolean("open_widget_config", false)
            if (shouldOpenConfig) {
                val widgetId = prefs.getInt("pending_widget_id", -1)
                val widgetType = prefs.getString("pending_widget_type", "small")
                
                // Clear the flags
                val editor = prefs.edit()
                editor.putBoolean("open_widget_config", false)
                editor.apply()
                
                // Build response
                val map = Arguments.createMap()
                map.putBoolean("openConfig", true)
                map.putInt("widgetId", widgetId)
                map.putString("widgetType", widgetType)
                
                promise?.resolve(map)
            } else {
                val map = Arguments.createMap()
                map.putBoolean("openConfig", false)
                promise?.resolve(map)
            }
        } catch (e: Exception) {
            promise?.reject("ERROR", "Failed to check widget config: ${e.message}")
        }
    }

    @ReactMethod
    fun updateUserMoodPercentages(data: String, promise: Promise? = null) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val editor = prefs.edit()
            
            // Log received data for debugging
            logWidgetData("Updating user mood percentages with", data)
            
            try {
                // Try to parse the data
                val json = JSONObject(data)
                
                // Extract narrative summary directly
                val narrative = json.optString("narrative", "")
                if (narrative.isNotEmpty()) {
                    editor.putString("user_mood_narrative", narrative)
                    Log.d(TAG, "Extracted narrative from data: $narrative")
                }
                
                // Try to extract a dominant color
                val emojis = json.optJSONArray("emojis")
                val names = json.optJSONArray("names")
                val percentages = json.optJSONArray("percentages")
                
                if (emojis != null && percentages != null) {
                    // Find the highest percentage mood
                    var highestPercent = 0
                    var dominantColor = "#3498db" // Default
                    
                    for (i in 0 until percentages.length()) {
                        val percent = percentages.optInt(i)
                        if (percent > highestPercent) {
                            highestPercent = percent
                            // Try to find this emoji's color
                            // (Would need to come from additional data)
                        }
                    }
                    
                    if (dominantColor.isNotEmpty()) {
                        editor.putString("user_mood_color", dominantColor)
                    }
                }
                
                // Store the full data for widget use
                editor.putString("user_color_mix_data", data)
                editor.putLong("user_color_mix_updated", System.currentTimeMillis())
                editor.apply()
                
                // Update all color widgets
                updateSmallColorWidgets(getContext())
                updateLargeColorWidgets(getContext())
                
                promise?.resolve(true)
            } catch (e: Exception) {
                // If parsing fails, still try to update widgets but log the error
                Log.e(TAG, "Error parsing mood percentages: ${e.message}", e)
                editor.putString("user_color_mix_data", data)
                editor.putLong("user_color_mix_updated", System.currentTimeMillis())
                editor.apply()
                
                // Still update widgets
                updateSmallColorWidgets(getContext())
                updateLargeColorWidgets(getContext())
                
                promise?.resolve(true)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to update user mood percentages: ${e.message}", e)
            promise?.reject("ERROR", "Failed to update user mood percentages: ${e.message}")
        }
    }

    @ReactMethod
    fun updateUserWordCloud(text: String, promise: Promise?) {
        try {
            // Log what we're receiving for debugging
            logWidgetData("Updating user word cloud with data", text)
            
            val editor = reactApplicationContext.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE).edit()
            
            // Parse the text if it's JSON to extract clean title and words
            val cleanText = formatWordCloudForWidget(text)
            
            // Store both raw data and formatted text
            editor.putString("user_word_cloud_raw", text)  // Store raw data for future reference
            editor.putString("user_word_cloud_text", cleanText) // Store formatted text for display
            editor.putLong("user_word_cloud_updated", System.currentTimeMillis())
            editor.apply()
            
            // Update widgets
            // updateSmallWordWidgets()  // <-- Comment this out by adding // at the beginning
            // updateLargeWordWidgets()  // <-- Comment this out by adding // at the beginning
            Log.d(TAG, "Updated user word cloud")
            
            promise?.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to update user word cloud: ${e.message}", e)
            promise?.reject("ERROR", "Failed to update user word cloud: ${e.message}")
        }
    }

    @ReactMethod
    fun updateFriendMoodPercentages(friendId: String, friendName: String, percentages: String, promise: Promise?) {
        try {
            val editor = reactApplicationContext.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE).edit()
            editor.putString("friend_${friendId}_mood_percentages", percentages)
            editor.putString("friend_${friendId}_name", friendName)
            editor.putLong("friend_${friendId}_mood_updated", System.currentTimeMillis())
            editor.apply()
            
            // Update widgets
            updateSmallColorWidgets(getContext())
            updateLargeColorWidgets(getContext())
            Log.d(TAG, "Updated friend $friendName mood percentages: $percentages")
            
            promise?.resolve(null)
        } catch (e: Exception) {
            promise?.reject("ERROR", "Failed to update friend mood percentages: ${e.message}")
        }
    }

    @ReactMethod
    fun updateFriendWordCloudData(friendId: String, friendName: String, data: String, promise: Promise?) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val editor = prefs.edit()
            
            // Log what we're receiving for debugging
            logWidgetData("Updating friend word cloud with data", data)
            
            // Store friend name
            editor.putString("friend_${friendId}_name", friendName)
            
            // Store raw data and formatted data
            editor.putString("friend_${friendId}_word_cloud_raw", data)
            
            // Parse the data to extract clean text
            val cleanText = formatWordCloudForWidget(data)
            editor.putString("friend_${friendId}_word_cloud_text", cleanText)
            
            editor.putLong("friend_${friendId}_word_cloud_updated", System.currentTimeMillis())
            editor.apply()
            
            Log.d(TAG, "Updated word cloud text for friend $friendName: $cleanText")
            
            // Update widgets showing this friend's data
            updateAllWordWidgetsForFriend(friendId, promise)
            
            promise?.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error updating friend word cloud: ${e.message}", e)
            promise?.reject("ERROR", "Failed to update friend word cloud: ${e.message}")
        }
    }

    // Helper methods to update widgets
    private fun updateSmallColorWidgets(context: Context) {
        val intent = Intent(context, SmallColorWidget::class.java)
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        
        val ids = AppWidgetManager.getInstance(context)
            .getAppWidgetIds(ComponentName(context, SmallColorWidget::class.java))
        
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        context.sendBroadcast(intent)
    }

    private fun updateSmallWordWidgets(context: Context = getContext()) {
        val actualContext = context ?: getContext()
        val intent = Intent(actualContext, SmallWordWidget::class.java)
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        
        val ids = AppWidgetManager.getInstance(actualContext)
            .getAppWidgetIds(ComponentName(actualContext, SmallWordWidget::class.java))
        
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        actualContext.sendBroadcast(intent)
    }

    private fun updateLargeColorWidgets(context: Context) {
        val intent = Intent(context, LargeColorWidget::class.java)
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        
        val ids = AppWidgetManager.getInstance(context)
            .getAppWidgetIds(ComponentName(context, LargeColorWidget::class.java))
        
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        context.sendBroadcast(intent)
    }

    private fun updateLargeWordWidgets(context: Context = getContext()) {
        val actualContext = context ?: getContext()
        val intent = Intent(actualContext, LargeWordWidget::class.java)
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        
        val ids = AppWidgetManager.getInstance(actualContext)
            .getAppWidgetIds(ComponentName(actualContext, LargeWordWidget::class.java))
        
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        actualContext.sendBroadcast(intent)
    }

    // Better approach: Extract core functionality to helper methods
    private fun updateUserWordCloudDataInternal(data: String): Boolean {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val editor = prefs.edit()
            
            // Parse the data
            val dataObj = JSONObject(data)
            
            // Store the data consistently as text for all word widgets
            val text = dataObj.optString("text", "")
            editor.putString("user_word_cloud_text", text)
            editor.putLong("user_word_cloud_updated", System.currentTimeMillis())
            editor.apply()
            
            Log.d(TAG, "Updated user word cloud text: $text")
            
            // Update all word widgets
            updateSmallWordWidgets(getContext())
            updateLargeWordWidgets(getContext())
            
            return true
        } catch (e: Exception) {
            Log.e(TAG, "Error updating user word cloud: ${e.message}", e)
            return false
        }
    }

    // Then update your @ReactMethod to use this helper
    @ReactMethod
    fun updateUserWordCloudData(data: String, promise: Promise?) {
        try {
            val success = updateUserWordCloudDataInternal(data)
            if (success) {
                promise?.resolve(true)
            } else {
                promise?.reject("ERROR", "Failed to update user word cloud")
            }
        } catch (e: Exception) {
            promise?.reject("ERROR", "Failed to update user word cloud: ${e.message}")
        }
    }

    // Update your internal method to call the helper directly
    private fun someInternalMethod() {
        updateUserWordCloudDataInternal("{\"text\":\"example\"}") 
        // No need for Promise parameter!
    }

    // Similarly for color mix data:
    private fun updateUserColorMixDataInternal(jsonData: String): Boolean {
        // ... extract the implementation from updateUserColorMixData ...
        // ... but without Promise handling ...
        return true
    }

    @ReactMethod
    fun updateUserColorMixData(jsonData: String, promise: Promise?) {
        try {
            val success = updateUserColorMixDataInternal(jsonData)
            if (success) {
                promise?.resolve(true)
            } else {
                promise?.reject("ERROR", "Failed to update color mix")
            }
        } catch (e: Exception) {
            promise?.reject("ERR_WIDGET_UPDATE", "Failed to update color mix: ${e.message}", e)
        }
    }

    private fun updateInternalColorMixData(data: String) {
        updateUserColorMixDataInternal(data)
        // No more need for dummyPromise
    }

    @ReactMethod
    fun forceUpdateAllWidgets(promise: Promise?) {
        try {
            val context = getContext()
            updateAllWidgets(context)
            promise?.resolve(true)
        } catch (e: Exception) {
            promise?.reject("ERROR", "Failed to force update widgets: ${e.message}")
        }
    }

    // Helper method to update all color widgets
    private fun updateAllColorWidgets() {
        try {
            // Update small color widgets
            val smallColorComponentName = ComponentName(reactApplicationContext, SmallColorWidget::class.java)
            val smallColorManager = AppWidgetManager.getInstance(reactApplicationContext)
            val smallColorIds = smallColorManager.getAppWidgetIds(smallColorComponentName)
            
            if (smallColorIds.isNotEmpty()) {
                Log.d(TAG, "Updating ${smallColorIds.size} small color widgets")
                val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
                intent.component = smallColorComponentName
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, smallColorIds)
                reactApplicationContext.sendBroadcast(intent)
            }
            
            // Update large color widgets
            val largeColorComponentName = ComponentName(reactApplicationContext, LargeColorWidget::class.java)
            val largeColorManager = AppWidgetManager.getInstance(reactApplicationContext)
            val largeColorIds = largeColorManager.getAppWidgetIds(largeColorComponentName)
            
            if (largeColorIds.isNotEmpty()) {
                Log.d(TAG, "Updating ${largeColorIds.size} large color widgets")
                val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
                intent.component = largeColorComponentName
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, largeColorIds)
                reactApplicationContext.sendBroadcast(intent)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error updating color widgets: ${e.message}", e)
        }
    }

    // Helper method to update all word widgets
    private fun updateAllWordWidgets() {
        try {
            // Update small word widgets
            val smallWordComponentName = ComponentName(reactApplicationContext, SmallWordWidget::class.java)
            val smallWordManager = AppWidgetManager.getInstance(reactApplicationContext)
            val smallWordIds = smallWordManager.getAppWidgetIds(smallWordComponentName)
            
            if (smallWordIds.isNotEmpty()) {
                Log.d(TAG, "Updating ${smallWordIds.size} small word widgets")
                val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
                intent.component = smallWordComponentName
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, smallWordIds)
                reactApplicationContext.sendBroadcast(intent)
            }
            
            // Update large word widgets  
            val largeWordComponentName = ComponentName(reactApplicationContext, LargeWordWidget::class.java)
            val largeWordManager = AppWidgetManager.getInstance(reactApplicationContext)
            val largeWordIds = largeWordManager.getAppWidgetIds(largeWordComponentName)
            
            if (largeWordIds.isNotEmpty()) {
                Log.d(TAG, "Updating ${largeWordIds.size} large word widgets")
                val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
                intent.component = largeWordComponentName
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, largeWordIds)
                reactApplicationContext.sendBroadcast(intent)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error updating word widgets: ${e.message}", e)
        }
    }

    @ReactMethod
    fun updateFriendColorMood(friendId: String, friendName: String, data: String, promise: Promise? = null) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val editor = prefs.edit()
            
            Log.d(TAG, "Updating friend mood data for $friendName ($friendId)")
            logWidgetData("Friend mood data", data)
            
            try {
                // Parse the JSON data
                val json = JSONObject(data)
                
                // Save the friend's name
                editor.putString("friend_${friendId}_name", friendName)
                
                // Extract narrative directly if available
                val narrative = json.optString("narrative", "")
                if (narrative.isNotEmpty()) {
                    editor.putString("friend_${friendId}_mood_narrative", narrative)
                    Log.d(TAG, "Extracted narrative for friend $friendId: $narrative")
                } else {
                    // Generate narrative from mood data if available
                    val emojis = json.optJSONArray("emojis")
                    val names = json.optJSONArray("names")
                    val percentages = json.optJSONArray("percentages")
                    
                    if (emojis != null && names != null && percentages != null &&
                        emojis.length() > 0 && names.length() > 0 && percentages.length() > 0) {
                        
                        // Generate a narrative summary like in ColorMixer.tsx
                        val generatedNarrative = generateNarrativeFromComponents(emojis, names, percentages)
                        
                        if (generatedNarrative.isNotEmpty()) {
                            editor.putString("friend_${friendId}_mood_narrative", generatedNarrative)
                            Log.d(TAG, "Generated narrative for friend $friendId: $generatedNarrative")
                        }
                    }
                }
                
                // Extract dominant color if available
                val moods = json.optJSONArray("moods")
                if (moods != null && moods.length() > 0) {
                    val topMood = moods.getJSONObject(0)
                    val moodColor = topMood.optString("color", "#3498db")
                    editor.putString("friend_${friendId}_mood_color", moodColor)
                }
                
                // Store the complete data
                editor.putString("friend_${friendId}_color_mix_data", data)
                editor.putLong("friend_${friendId}_color_mix_updated", System.currentTimeMillis())
                editor.apply()
                
                // Update all widgets that might be showing this friend's data
                updateAllWidgets()
                
                promise?.resolve(true)
            } catch (e: Exception) {
                // If parsing fails, still save the raw data
                Log.e(TAG, "Error parsing friend mood data: ${e.message}", e)
                editor.putString("friend_${friendId}_color_mix_data", data)
                editor.putLong("friend_${friendId}_color_mix_updated", System.currentTimeMillis())
                editor.apply()
                
                // Still try to update widgets
                updateAllWidgets()
                
                promise?.resolve(true)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to update friend mood data: ${e.message}", e)
            promise?.reject("ERROR", "Failed to update friend mood data: ${e.message}")
        }
    }

    // Helper method to generate narrative from component arrays
    private fun generateNarrativeFromComponents(emojis: JSONArray, names: JSONArray, percentages: JSONArray): String {
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
            
            if (moods.isEmpty()) return ""
            
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
            Log.e(TAG, "Error generating narrative from components: ${e.message}")
            return ""
        }
    }

    @ReactMethod
    fun updateFriendsList(friendsJson: String, promise: Promise?) {
        try {
            val editor = reactApplicationContext.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE).edit()
            editor.putString("friends_list", friendsJson)
            editor.apply()
            Log.d(TAG, "Updated friends list")
            
            promise?.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error updating friends list: ${e.message}", e)
            promise?.reject("ERROR", "Failed to update friends list: ${e.message}")
        }
    }

    @ReactMethod
    fun debugWidgets(promise: Promise?) {
        try {
            val prefs = reactApplicationContext.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val allPrefs = prefs.all
            val result = JSONObject()
            
            for (key in allPrefs.keys) {
                result.put(key, allPrefs[key].toString())
            }
            
            // Check resource existence
            val resources = reactApplicationContext.resources
            val thoughtBubbleId = resources.getIdentifier("thought_bubble", "drawable", reactApplicationContext.packageName)
            val glassBallId = resources.getIdentifier("glass_ball", "drawable", reactApplicationContext.packageName)
            
            result.put("thought_bubble_exists", thoughtBubbleId != 0)
            result.put("glass_ball_exists", glassBallId != 0)
            
            promise?.resolve(result.toString())
        } catch (e: Exception) {
            promise?.reject("ERROR", "Failed to debug widgets: ${e.message}")
        }
    }

    @ReactMethod
    fun updateWidgetData(widgetType: String, data: ReadableMap, promise: Promise?) {
        try {
            val context = reactApplicationContext
            val appWidgetManager = AppWidgetManager.getInstance(context)
            
            // Save the data for the widgets to use
            val sharedPreferences = context.getSharedPreferences("MoodWidgetData", Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            
            // Convert data to JSON string and save
            editor.putString("widgetData_$widgetType", data.toString())
            editor.apply()
            
            Log.d(TAG, "Saved widget data for $widgetType: ${data.toString()}")
            
            // Update the appropriate widgets based on widgetType
            when (widgetType) {
                "small_color" -> {
                    val intent = Intent(context, SmallColorWidget::class.java)
                    intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
                    val ids = appWidgetManager.getAppWidgetIds(ComponentName(context, SmallColorWidget::class.java))
                    intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
                    context.sendBroadcast(intent)
                }
                "large_color" -> {
                    val intent = Intent(context, LargeColorWidget::class.java)
                    intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
                    val ids = appWidgetManager.getAppWidgetIds(ComponentName(context, LargeColorWidget::class.java))
                    intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
                    context.sendBroadcast(intent)
                }
                "small_word" -> {
                    val intent = Intent(context, SmallWordWidget::class.java)
                    intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
                    val ids = appWidgetManager.getAppWidgetIds(ComponentName(context, SmallWordWidget::class.java))
                    intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
                    context.sendBroadcast(intent)
                }
                "large_word" -> {
                    val intent = Intent(context, LargeWordWidget::class.java)
                    intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
                    val ids = appWidgetManager.getAppWidgetIds(ComponentName(context, LargeWordWidget::class.java))
                    intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
                    context.sendBroadcast(intent)
                }
                else -> {
                    promise?.reject("ERROR", "Unknown widget type: $widgetType")
                    return
                }
            }
            
            promise?.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error updating widget data: ${e.message}")
            promise?.reject("ERROR", "Failed to update widget data: ${e.message}")
        }
    }

    private fun logWidgetData(tag: String, data: String) {
        try {
            // Truncate long data to avoid log overflow
            val maxLogLength = 500
            val truncatedData = if (data.length > maxLogLength) {
                data.substring(0, maxLogLength) + "... (truncated, total length: ${data.length})"
            } else {
                data
            }
            
            Log.d(TAG, "$tag: $truncatedData")
        } catch (e: Exception) {
            Log.e(TAG, "Error logging widget data: ${e.message}", e)
        }
    }

    private fun updateAllWordWidgetsForFriend(friendId: String, promise: Promise?) {
        try {
            val context = getContext()
            
            // Update small word widgets
            val smallWordIntent = Intent(context, SmallWordWidget::class.java)
            smallWordIntent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val smallWordIds = AppWidgetManager.getInstance(context)
                .getAppWidgetIds(ComponentName(context, SmallWordWidget::class.java))
            smallWordIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, smallWordIds)
            context.sendBroadcast(smallWordIntent)
            
            // Update large word widgets
            val largeWordIntent = Intent(context, LargeWordWidget::class.java)
            largeWordIntent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val largeWordIds = AppWidgetManager.getInstance(context)
                .getAppWidgetIds(ComponentName(context, LargeWordWidget::class.java))
            largeWordIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, largeWordIds)
            context.sendBroadcast(largeWordIntent)
            
        } catch (e: Exception) {
            Log.e(TAG, "Error updating word widgets for friend: ${e.message}", e)
            promise?.reject("ERROR", "Failed to update word widgets for friend: ${e.message}")
        }
    }

    // Add this helper method to properly format word cloud data
    private fun formatWordCloudForWidget(data: String): String {
        try {
            // Handle case where data is not JSON
            if (!data.trim().startsWith("{")) {
                return data
            }
            
            val json = JSONObject(data)
            
            // Extract title
            val title = json.optString("title", "")
            
            // Extract words array
            val wordsArray = json.optJSONArray("words")
            if (wordsArray != null && wordsArray.length() > 0) {
                val wordsList = mutableListOf<String>()
                
                for (i in 0 until wordsArray.length()) {
                    val wordObj = wordsArray.optJSONObject(i)
                    val text = wordObj?.optString("text", null)
                    if (!text.isNullOrEmpty()) {
                        wordsList.add(text)
                    }
                }
                
                // Format: Title followed by the words
                return if (title.isNotEmpty() && wordsList.isNotEmpty()) {
                    "$title\n\n${wordsList.joinToString(", ")}"
                } else if (wordsList.isNotEmpty()) {
                    wordsList.joinToString(", ")
                } else if (title.isNotEmpty()) {
                    title
                } else {
                    "No mood data"
                }
            }
            
            // If there's a text field directly in the JSON
            val text = json.optString("text", "")
            if (text.isNotEmpty()) {
                return text
            }
            
            // If we can't find any useful data, return the title or a default message
            return title.ifEmpty { "No mood data" }
        } catch (e: Exception) {
            Log.e(TAG, "Error formatting word cloud data: ${e.message}", e)
            return data // Return original data if parsing fails
        }
    }

    private fun updateAllWidgets(context: Context) {
        val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
        
        // Update all widget types
        val smallColorWidgetIntent = Intent(context, SmallColorWidget::class.java)
        smallColorWidgetIntent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        val smallColorWidgetIds = AppWidgetManager.getInstance(context)
            .getAppWidgetIds(ComponentName(context, SmallColorWidget::class.java))
        smallColorWidgetIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, smallColorWidgetIds)
        context.sendBroadcast(smallColorWidgetIntent)
        
        // Repeat for other widget types
        val largeColorWidgetIntent = Intent(context, LargeColorWidget::class.java)
        largeColorWidgetIntent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        val largeColorWidgetIds = AppWidgetManager.getInstance(context)
            .getAppWidgetIds(ComponentName(context, LargeColorWidget::class.java))
        largeColorWidgetIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, largeColorWidgetIds)
        context.sendBroadcast(largeColorWidgetIntent)
        
        // Add similar code for SmallWordWidget and LargeWordWidget if needed
        
        Log.d(TAG, "Broadcast sent to update all widgets")
    }

    @ReactMethod
    fun updateFriendWordCloud(friendId: String, friendName: String, data: String, promise: Promise) {
        try {
            val context = getContext()
            // Update friend's word cloud data
            updateFriendWordCloudData(friendId, friendName, data, promise)
            // Force update relevant widgets
            updateAllWordWidgetsForFriend(friendId, promise)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to update friend word cloud: ${e.message}")
        }
    }
} 