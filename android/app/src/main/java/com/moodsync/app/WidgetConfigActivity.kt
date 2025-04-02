package com.moodsync.app

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.Spinner
import android.widget.TextView
import android.widget.ArrayAdapter
import android.content.Context
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject

class WidgetConfigActivity : Activity() {
    private val TAG = "WidgetConfigActivity"
    private var mAppWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID
    private var widgetType = ""
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Set the result to CANCELED. This will cause the widget host to cancel
        // out of the widget placement if the user presses the back button.
        setResult(RESULT_CANCELED)
        
        setContentView(R.layout.widget_config_activity)
        
        // Find the widget id from the intent
        val intent = intent
        val extras = intent.extras
        if (extras != null) {
            mAppWidgetId = extras.getInt(
                AppWidgetManager.EXTRA_APPWIDGET_ID,
                AppWidgetManager.INVALID_APPWIDGET_ID
            )
            widgetType = extras.getString("widgetType", "")
        }
        
        // If this activity was started with an intent without an app widget ID,
        // finish with an error.
        if (mAppWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish()
            return
        }
        
        val titleTextView = findViewById<TextView>(R.id.config_title)
        val moodTypeRadioGroup = findViewById<RadioGroup>(R.id.mood_type_radio_group)
        val ownMoodRadio = findViewById<RadioButton>(R.id.radio_own_mood)
        val friendMoodRadio = findViewById<RadioButton>(R.id.radio_friend_mood)
        val friendSpinner = findViewById<Spinner>(R.id.friend_spinner)
        val saveButton = findViewById<Button>(R.id.button_save)
        
        // Set title based on widget type
        when (widgetType) {
            "small_color" -> titleTextView.text = "Configure Color Mix Widget"
            "small_word" -> titleTextView.text = "Configure Word Cloud Widget"
            "large_color" -> titleTextView.text = "Configure Color Bubble Widget"
            "large_word" -> titleTextView.text = "Configure Thought Bubble Widget"
            else -> titleTextView.text = "Configure Widget"
        }
        
        // Setup friend spinner
        val friends = loadFriendsList()
        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            friends.map { it.second } // Display names
        )
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        friendSpinner.adapter = adapter
        
        // Hide friend spinner initially
        friendSpinner.visibility = android.view.View.GONE
        
        // Handle radio button clicks
        moodTypeRadioGroup.setOnCheckedChangeListener { _, checkedId ->
            friendSpinner.visibility = if (checkedId == R.id.radio_friend_mood) {
                android.view.View.VISIBLE
            } else {
                android.view.View.GONE
            }
        }
        
        // Set the default based on previous configuration
        val prefs = getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
        val isOwnMood = prefs.getBoolean("widget_${mAppWidgetId}_is_own_mood", true)
        if (isOwnMood) {
            ownMoodRadio.isChecked = true
        } else {
            friendMoodRadio.isChecked = true
            friendSpinner.visibility = android.view.View.VISIBLE
            
            // Try to select the previously selected friend
            val friendId = prefs.getString("widget_${mAppWidgetId}_friend_id", "")
            val index = friends.indexOfFirst { it.first == friendId }
            if (index >= 0) {
                friendSpinner.setSelection(index)
            }
        }
        
        // Handle save button
        saveButton.setOnClickListener {
            val editor = prefs.edit()
            val isOwnMoodSelected = ownMoodRadio.isChecked
            editor.putBoolean("widget_${mAppWidgetId}_is_own_mood", isOwnMoodSelected)
            
            if (!isOwnMoodSelected && friendSpinner.selectedItemPosition >= 0) {
                val selectedFriend = friends[friendSpinner.selectedItemPosition]
                editor.putString("widget_${mAppWidgetId}_friend_id", selectedFriend.first)
                editor.putString("widget_${mAppWidgetId}_friend_name", selectedFriend.second)
            }
            
            editor.apply()
            
            // Update the widget
            updateWidget(mAppWidgetId, widgetType)
            
            // Set the result to OK
            val resultValue = Intent()
            resultValue.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, mAppWidgetId)
            setResult(RESULT_OK, resultValue)
            finish()
        }
    }
    
    private fun loadFriendsList(): List<Pair<String, String>> {
        val prefs = getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
        val friendsJson = prefs.getString("friends_list", "[]")
        
        val friends = mutableListOf<Pair<String, String>>()
        
        try {
            val jsonArray = JSONArray(friendsJson)
            for (i in 0 until jsonArray.length()) {
                val friend = jsonArray.getJSONObject(i)
                val id = friend.getString("id")
                val name = friend.getString("name")
                friends.add(Pair(id, name))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error loading friends list: ${e.message}", e)
        }
        
        // Add a placeholder if list is empty
        if (friends.isEmpty()) {
            friends.add(Pair("demo1", "Demo Friend"))
        }
        
        return friends
    }
    
    private fun updateWidget(appWidgetId: Int, widgetType: String) {
        val intent = when (widgetType) {
            "small_color" -> Intent(this, SmallColorWidget::class.java)
            "small_word" -> Intent(this, SmallWordWidget::class.java)
            "large_color" -> Intent(this, LargeColorWidget::class.java)
            "large_word" -> Intent(this, LargeWordWidget::class.java)
            else -> Intent(this, SmallColorWidget::class.java)
        }
        
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, intArrayOf(appWidgetId))
        sendBroadcast(intent)
    }
} 