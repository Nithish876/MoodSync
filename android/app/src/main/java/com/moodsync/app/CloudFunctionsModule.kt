package com.moodsync.app

import android.util.Log
import com.facebook.react.bridge.*
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.RemoteMessage
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import org.json.JSONObject
import org.json.JSONArray
import java.util.HashMap

/**
 * Module to handle Firebase Cloud Functions calls from React Native
 */
class CloudFunctionsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val TAG = "CloudFunctions"
    private val executor: ExecutorService = Executors.newCachedThreadPool()

    override fun getName(): String {
        return "CloudFunctions"
    }

    /**
     * Send push notifications to multiple FCM tokens
     */
    @ReactMethod
    fun sendNotifications(tokens: ReadableArray, title: String, body: String, dataString: String, promise: Promise?) {
        Log.d(TAG, "Sending notifications to ${tokens.size()} recipients")
        
        // Convert dataString to a Map for FCM
        val dataMap = HashMap<String, String>()
        try {
            val dataJson = JSONObject(dataString)
            val keys = dataJson.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                dataMap[key] = dataJson.getString(key)
            }
            // Add notification type
            dataMap["type"] = "moodUpdate"
            dataMap["title"] = title
            dataMap["body"] = body
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing data JSON", e)
            promise?.reject("INVALID_DATA", "Invalid data JSON: ${e.message}")
            return
        }
        
        // Process in a background thread to avoid blocking the JS thread
        executor.execute {
            try {
                var successCount = 0
                val failedTokens = ArrayList<String>()
                
                // Send to each token
                for (i in 0 until tokens.size()) {
                    val token = tokens.getString(i)
                    try {
                        val message = RemoteMessage.Builder(token)
                            .setMessageId(System.currentTimeMillis().toString())
                            .setData(dataMap)
                            .build()
                            
                        // Send the message
                        FirebaseMessaging.getInstance().send(message)
                        successCount++
                        Log.d(TAG, "Successfully sent to token: $token")
                    } catch (e: Exception) {
                        Log.e(TAG, "Failed to send to token: $token", e)
                        failedTokens.add(token)
                    }
                }
                
                // Return result
                val result = Arguments.createMap()
                result.putInt("successCount", successCount)
                result.putInt("failureCount", failedTokens.size)
                if (failedTokens.isNotEmpty()) {
                    val failedArray = Arguments.createArray()
                    for (token in failedTokens) {
                        failedArray.pushString(token)
                    }
                    result.putArray("failedTokens", failedArray)
                }
                
                reactApplicationContext.runOnJSQueueThread {
                    promise?.resolve(result)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error sending notifications", e)
                reactApplicationContext.runOnJSQueueThread {
                    promise?.reject("SEND_ERROR", "Error sending notifications: ${e.message}")
                }
            }
        }
    }
    
    /**
     * Check if FCM is properly configured
     */
    @ReactMethod
    fun checkFcmConfiguration(promise: Promise?) {
        try {
            val result = Arguments.createMap()
            result.putBoolean("isAvailable", true)
            
            // Try to get the FCM token as a test
            FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val token = task.result
                    result.putBoolean("hasToken", token != null && token.isNotEmpty())
                    result.putString("token", token)
                    promise?.resolve(result)
                } else {
                    result.putBoolean("hasToken", false)
                    result.putString("error", task.exception?.message ?: "Unknown error")
                    promise?.resolve(result)
                }
            }
        } catch (e: Exception) {
            val result = Arguments.createMap()
            result.putBoolean("isAvailable", false)
            result.putString("error", e.message)
            promise?.resolve(result)
        }
    }
} 