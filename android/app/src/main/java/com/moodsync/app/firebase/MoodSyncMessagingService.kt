package com.moodsync.app.firebase

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.moodsync.app.MainActivity
import com.moodsync.app.R
import org.json.JSONObject
import java.io.File
import android.appwidget.AppWidgetManager

class MoodSyncMessagingService : FirebaseMessagingService() {
    private val TAG = "MoodSyncMessaging"

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "Refreshed FCM token: $token")
        // Store the token in a file so that the React Native app can access it
        saveTokenToFile(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        Log.d(TAG, "From: ${remoteMessage.from}")

        // Check if message contains a data payload
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "Message data payload: ${remoteMessage.data}")
            
            try {
                val data = remoteMessage.data
                val userId = data["userId"] ?: ""
                val type = data["type"] ?: ""
                
                if (type == "moodUpdate") {
                    // Handle mood update notification
                    val title = data["title"] ?: "Mood Update"
                    val body = data["body"] ?: "A friend has updated their mood"
                    
                    // Show notification
                    sendNotification(title, body)
                    
                    // Trigger widget refresh
                    triggerWidgetRefresh(userId)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error processing message data", e)
            }
        }

        // Check if message contains a notification payload
        remoteMessage.notification?.let {
            Log.d(TAG, "Message Notification Body: ${it.body}")
            sendNotification(it.title ?: "MoodSync", it.body ?: "")
        }
    }

    private fun sendNotification(title: String, messageBody: String) {
        val channelId = getString(R.string.default_notification_channel_id)
        val intent = Intent(this, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(messageBody)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Create the notification channel for Android 8.0+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Mood Updates",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Receive notifications when friends update their mood"
                enableLights(true)
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        notificationManager.notify(0, notificationBuilder.build())
    }

    private fun triggerWidgetRefresh(userId: String) {
        // This will be called to trigger widget refresh when a mood update notification is received
        Log.d(TAG, "Triggering widget refresh for user: $userId")
        
        // Send a broadcast intent that the widget providers can listen for
        val intent = Intent("com.moodsync.app.WIDGET_UPDATE")
        intent.putExtra("userId", userId)
        
        // Send to each widget provider class directly
        val packageName = applicationContext.packageName
        val widgetClasses = arrayOf(
            "${packageName}.LargeColorWidget",
            "${packageName}.SmallColorWidget", 
            "${packageName}.LargeWordWidget",
            "${packageName}.SmallWordWidget"
        )
        
        // Send to each widget provider
        for (className in widgetClasses) {
            try {
                val componentClass = Class.forName(className)
                val componentName = android.content.ComponentName(applicationContext, componentClass)
                val specificIntent = Intent(intent)
                specificIntent.component = componentName
                sendBroadcast(specificIntent)
                Log.d(TAG, "Sent update to $className")
            } catch (e: Exception) {
                Log.e(TAG, "Error sending to $className: ${e.message}")
            }
        }
        
        // Also update widget preferences to force a refresh on next read
        try {
            // Mark all widgets configured for this friend to be refreshed
            val prefs = applicationContext.getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)
            val allKeys = prefs.all.keys
            
            // Find all widget configurations that reference this user
            for (key in allKeys) {
                if (key.contains("_friend_id") && prefs.getString(key, "") == userId) {
                    // Extract widget ID from key (format: "widget_ID_friend_id")
                    val parts = key.split("_")
                    if (parts.size >= 2) {
                        val widgetId = parts[1].toIntOrNull()
                        if (widgetId != null) {
                            // Mark this widget for refresh by updating its timestamp
                            val refreshKey = "widget_${widgetId}_last_refresh"
                            prefs.edit().putLong(refreshKey, System.currentTimeMillis()).apply()
                            Log.d(TAG, "Marked widget $widgetId for refresh (friend: $userId)")
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error updating widget preferences: ${e.message}")
        }
        
        // Also send a general update broadcast
        sendBroadcast(Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE))
    }
    
    private fun saveTokenToFile(token: String) {
        try {
            val file = File(applicationContext.filesDir, "fcm_token.txt")
            file.writeText(token)
            Log.d(TAG, "FCM token saved to file: ${file.absolutePath}")
        } catch (e: Exception) {
            Log.e(TAG, "Error saving FCM token to file", e)
        }
    }
} 