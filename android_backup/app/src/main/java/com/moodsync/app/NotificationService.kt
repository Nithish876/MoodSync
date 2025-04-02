package com.moodsync.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NotificationService(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    companion object {
        const val NAME = "NotificationService"
        private const val CHANNEL_ID = "friend_updates"
        private const val CHANNEL_NAME = "Friend Mood Updates"
    }
    
    override fun getName(): String {
        return NAME
    }
    
    @ReactMethod
    fun createNotificationChannels(promise: Promise?) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                
                // Create the friend updates channel
                val channel = NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Notifications when your friends update their moods"
                    enableLights(true)
                    lightColor = 0xFFFF8800.toInt()
                    enableVibration(true)
                    vibrationPattern = longArrayOf(0, 100, 200, 300)
                }
                
                notificationManager.createNotificationChannel(channel)
            }
            
            promise?.resolve(true)
        } catch (e: Exception) {
            promise?.reject("ERROR", "Failed to create notification channels: ${e.message}")
        }
    }
    
    @ReactMethod
    fun sendFriendUpdateNotification(friendName: String, moodEmoji: String, promise: Promise?) {
        try {
            val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            
            // Build notification
            val notificationBuilder = NotificationCompat.Builder(reactApplicationContext, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("Friend Mood Update")
                .setContentText("$friendName just updated their mood to $moodEmoji")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
            
            // Send notification
            notificationManager.notify(System.currentTimeMillis().toInt(), notificationBuilder.build())
            
            promise?.resolve(true)
        } catch (e: Exception) {
            promise?.reject("ERROR", "Failed to send notification: ${e.message}")
        }
    }
} 