This document describes how to publish a widget using a widget provider. For details about creating your own AppWidgetHost to host app widgets, see Build a widget host.

For information about how to design your widget, see App widgets overview.

Widget components
To create a widget, you need the following basic components:

AppWidgetProviderInfo object
Describes the metadata for a widget, such as the widget's layout, update frequency, and AppWidgetProvider class. AppWidgetProviderInfo is defined in XML, as described in this document.
AppWidgetProvider class
Defines the basic methods that let you programmatically interface with the widget. Through it, you receive broadcasts when the widget is updated, enabled, disabled, or deleted. You declare AppWidgetProvider in the manifest and then implement it, as described in this document.
View layout
Defines the initial layout for the widget. The layout is defined in XML, as described in this document.
Figure 2 shows how these components fit into the overall app widget processing flow.

App widget processing flow
Figure 2. App widget processing flow.
Note: Android Studio can automatically create a set of AppWidgetProviderInfo, AppWidgetProvider, and view layout files. Choose New > Widget > App Widget.
If your widget needs user configuration, implement the app widget configuration activity. This activity lets users modify widget settings—for example, the time zone for a clock widget.

Starting in Android 12 (API level 31), you can provide a default configuration and let users reconfigure the widget later. See Use the widget's default configuration and Enable users to reconfigure placed widgets for more details.
In Android 11 (API level 30) or lower, this activity is launched every time the user adds the widget to their home screen.
We also recommend the following improvements: flexible widget layouts, miscellaneous enhancements, advanced widgets, collection widgets, and building a widget host.

Declare the AppWidgetProviderInfo XML
The AppWidgetProviderInfo object defines the essential qualities of a widget. Define the AppWidgetProviderInfo object in an XML resource file using a single <appwidget-provider> element and save it in the project's res/xml/ folder.

This is shown in the following example:

<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="40dp"
    android:minHeight="40dp"
    android:targetCellWidth="1"
    android:targetCellHeight="1"
    android:maxResizeWidth="250dp"
    android:maxResizeHeight="120dp"
    android:updatePeriodMillis="86400000"
    android:description="@string/example_appwidget_description"
    android:previewLayout="@layout/example_appwidget_preview"
    android:initialLayout="@layout/example_loading_appwidget"
    android:configure="com.example.android.ExampleAppWidgetConfigurationActivity"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:widgetFeatures="reconfigurable|configuration_optional">
</appwidget-provider>
Widget sizing attributes
The default home screen positions widgets in its window based on a grid of cells that have a defined height and width. Most home screens only let widgets take on sizes that are integer multiples of the grid cells—for example, two cells horizontally by three cells vertically.

The widget sizing attributes let you specify a default size for your widget and provide lower and upper bounds on the size of the widget. In this context, the default size of a widget is the size that the widget takes on when it is first added to the home screen.

The following table describes the <appwidget-provider> attributes pertaining to widget sizing:

Attributes and description
targetCellWidth and targetCellHeight (Android 12), minWidth and minHeight
Starting in Android 12, the targetCellWidth and targetCellHeight attributes specify the default size of the widget in terms of grid cells. These attributes are ignored in Android 11 and lower, and can be ignored if the home screen doesn't support a grid-based layout.
The minWidth and minHeight attributes specify the default size of the widget in dp. If the values for a widget's minimum width or height don't match the dimensions of the cells, then the values are rounded up to the nearest cell size.
We recommend specifying both sets of attributes—targetCellWidth and targetCellHeight, and minWidth and minHeight—so that your app can fall back to using minWidth and minHeight if the user's device doesn't support targetCellWidth and targetCellHeight. If supported, the targetCellWidth and targetCellHeight attributes take precedence over the minWidth and minHeight attributes.
minResizeWidth and minResizeHeight Specify the widget's absolute minimum size. These values specify the size under which the widget is illegible or otherwise unusable. Using these attributes lets the user resize the widget to a size that is smaller than the default widget size. The minResizeWidth attribute is ignored if it is greater than minWidth or if horizontal resizing isn't enabled. See resizeMode. Likewise, the minResizeHeight attribute is ignored if it is greater than minHeight or if vertical resizing isn't enabled.
maxResizeWidth and maxResizeHeight Specify the widget's recommended maximum size. If the values aren't a multiple of the grid cell dimensions, they are rounded up to the nearest cell size. The maxResizeWidth attribute is ignored if it is smaller than minWidth or if horizontal resizing isn't enabled. See resizeMode. Likewise, the maxResizeHeight attribute is ignored if it is greater than minHeight or if vertical resizing isn't enabled. Introduced in Android 12.
resizeMode Specifies the rules by which a widget can be resized. You can use this attribute to make home screen widgets resizable horizontally, vertically, or on both axes. Users touch & hold a widget to show its resize handles, then drag the horizontal or vertical handles to change its size on the layout grid. Values for the resizeMode attribute include horizontal, vertical, and none. To declare a widget as resizable horizontally and vertically, use horizontal|vertical.
Example
To illustrate how the attributes in the preceding table affect widget sizing, assume the following specifications:

A grid cell is 30 dp wide and 50 dp tall.
The following attribute specification is provided:

<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="80dp"
    android:minHeight="80dp"
    android:targetCellWidth="2"
    android:targetCellHeight="2"
    android:minResizeWidth="40dp"
    android:minResizeHeight="40dp"
    android:maxResizeWidth="120dp"
    android:maxResizeHeight="120dp"
    android:resizeMode="horizontal|vertical" />
Starting with Android 12:

Use the targetCellWidth and targetCellHeight attributes as the default size of the widget.

The widget's size is 2x2 by default. The widget can be resized down to 2x1 or up to 4x3.

Android 11 and lower:

Use the minWidth and minHeight attributes to compute the default size of the widget.

The default width = Math.ceil(80 / 30) = 3

The default height = Math.ceil(80 / 50) = 2

The widget's size is 3x2 by default. The widget can be resized down to 2x1 or up to full screen.

Note: The actual widget size computation is more complex than the preceding formula because it also includes widget margins and spacing between the grid cells.
Additional widget attributes
The following table describes the <appwidget-provider> attributes pertaining to qualities other than widget sizing.

Attributes and description
updatePeriodMillis Defines how often the widget framework requests an update from the AppWidgetProvider by calling the onUpdate() callback method. The actual update isn't guaranteed to occur exactly on time with this value, and we recommend updating as infrequently as possible—no more than once an hour—to conserve the battery. For the full list of considerations to pick an appropriate update period, see Optimizations for updating widget content.
initialLayout Points to the layout resource that defines the widget layout.
configure Defines the activity that launches when the user adds the widget, letting them configure widget properties. See Enable users to configure widgets. Starting in Android 12, your app can skip the initial configuration. See Use the widget's default configuration for details.
description Specifies the description for the widget picker to display for your widget. Introduced in Android 12.
previewLayout (Android 12) and previewImage (Android 11 and lower)
Starting in Android 12, the previewLayout attribute specifies a scalable preview, which you provide as an XML layout set to the widget's default size. Ideally, the layout XML specified as this attribute is the same layout XML as the actual widget with realistic default values.
In Android 11 or lower, the previewImage attribute specifies a preview of what the widget looks like after it's configured, which the user sees when selecting the app widget. If not supplied, the user instead sees your app's launcher icon. This field corresponds to the android:previewImage attribute in the <receiver> element in the AndroidManifest.xml file.
Note: We recommend specifying both the previewImage and previewLayout attributes so that your app can fall back to using previewImage if the user's device doesn't support previewLayout. For more details, see Backward compatibility with scalable widget previews.
autoAdvanceViewId Specifies the view ID of the widget subview that is auto-advanced by the widget's host.
widgetCategory Declares whether your widget can be displayed on the home screen (home_screen), the lock screen (keyguard), or both. For Android 5.0 and higher, only home_screen is valid.
widgetFeatures Declares features supported by the widget. For example, if you want your widget to use its default configuration when a user adds it, specify both the configuration_optional and reconfigurable flags. This bypasses launching the configuration activity after a user adds the widget. The user can still reconfigure the widget afterward.
Use the AppWidgetProvider class to handle widget broadcasts
The AppWidgetProvider class handles widget broadcasts and updates the widget in response to widget lifecycle events. The following sections describe how to declare AppWidgetProvider in the manifest and then implement it.

Declare a widget in the manifest
First, declare the AppWidgetProvider class in your app's AndroidManifest.xml file, as shown in the following example:

<receiver android:name="ExampleAppWidgetProvider"
                 android:exported="false">
<intent-filter>
<action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
</intent-filter>
<meta-data android:name="android.appwidget.provider"
               android:resource="@xml/example_appwidget_info" />
</receiver>
The <receiver> element requires the android:name attribute, which specifies the AppWidgetProvider used by the widget. The component must not be exported unless a separate process needs to broadcast to your AppWidgetProvider, which usually isn't the case.

The <intent-filter> element must include an <action> element with the android:name attribute. This attribute specifies that the AppWidgetProvider accepts the ACTION_APPWIDGET_UPDATE broadcast. This is the only broadcast that you must explicitly declare. The AppWidgetManager automatically sends all other widget broadcasts to the AppWidgetProvider as necessary.

The <meta-data> element specifies the AppWidgetProviderInfo resource and requires the following attributes:

android:name: specifies the metadata name. Use android.appwidget.provider to identify the data as the AppWidgetProviderInfo descriptor.
android:resource: specifies the AppWidgetProviderInfo resource location.
Implement the AppWidgetProvider class
The AppWidgetProvider class extends BroadcastReceiver as a convenience class to handle widget broadcasts. It receives only the event broadcasts that are relevant to the widget, such as when the widget is updated, deleted, enabled, and disabled. When these broadcast events occur, the following AppWidgetProvider methods are called:

onUpdate()
This is called to update the widget at intervals defined by the updatePeriodMillis attribute in the AppWidgetProviderInfo. See the table describing additional widget attributes in this page for more information.
This method is also called when the user adds the widget, so it performs the essential setup such as defining event handlers for View objects or starting jobs to load data to display in the widget. However, if you declare a configuration activity without the configuration_optional flag, this method is not called when the user adds the widget, but it is called for the subsequent updates. It is the responsibility of the configuration activity to perform the first update when configuration is complete. See Enable users to configure app widgets for more information.
The most important callback is onUpdate(). See Handle events with the onUpdate() class in this page for more information.
onAppWidgetOptionsChanged()
This is called when the widget is first placed and any time the widget is resized. Use this callback to show or hide content based on the widget's size ranges. Get the size ranges—and, starting in Android 12, the list of possible sizes a widget instance can take—by calling getAppWidgetOptions(), which returns a Bundle that includes the following:

OPTION_APPWIDGET_MIN_WIDTH: contains the lower bound on the width, in dp units, of a widget instance.
OPTION_APPWIDGET_MIN_HEIGHT: contains the lower bound on the height, in dp units, of a widget instance.
OPTION_APPWIDGET_MAX_WIDTH: contains the upper bound on the width, in dp units, of a widget instance.
OPTION_APPWIDGET_MAX_HEIGHT: contains the upper bound on the height, in dp units, of a widget instance.
OPTION_APPWIDGET_SIZES: contains the list of possible sizes (List<SizeF>), in dp units, that a widget instance can take. Introduced in Android 12.
onDeleted(Context, int[])
This is called every time a widget is deleted from the widget host.

onEnabled(Context)
This is called when an instance of the widget is created for the first time. For example, if the user adds two instances of your widget, this is only called the first time. If you need to open a new database or perform another setup that only needs to occur once for all widget instances, then this is a good place to do it.

onDisabled(Context)
This is called when the last instance of your widget is deleted from the widget host. This is where you clean up any work done in onEnabled(Context), such as deleting a temporary database.

onReceive(Context, Intent)
This is called for every broadcast and before each of the preceding callback methods. You normally don't need to implement this method, because the default AppWidgetProvider implementation filters all widget broadcasts and calls the preceding methods as appropriate.

You must declare your AppWidgetProvider class implementation as a broadcast receiver using the <receiver> element in the AndroidManifest. See Declare a widget in the manifest in this page for more information.

Handle events with the onUpdate() class
The most important AppWidgetProvider callback is onUpdate(), because it is called when each widget is added to a host, unless you use a configuration activity without the configuration_optional flag. If your widget accepts any user interaction events, then register the event handlers in this callback. If your widget doesn't create temporary files or databases, or perform other work that requires clean-up, then onUpdate() might be the only callback method you need to define.

For example, if you want a widget with a button that launches an activity when tapped, you can use the following implementation of AppWidgetProvider:

Kotlin
Java

class ExampleAppWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetIds: IntArray
    ) {
        // Perform this loop procedure for each widget that belongs to this
        // provider.
        appWidgetIds.forEach { appWidgetId ->
            // Create an Intent to launch ExampleActivity.
            val pendingIntent: PendingIntent = PendingIntent.getActivity(
                    /* context = */ context,
                    /* requestCode = */  0,
                    /* intent = */ Intent(context, ExampleActivity::class.java),
                    /* flags = */ PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // Get the layout for the widget and attach an onClick listener to
            // the button.
            val views: RemoteViews = RemoteViews(
                    context.packageName,
                    R.layout.appwidget_provider_layout
            ).apply {
                setOnClickPendingIntent(R.id.button, pendingIntent)
            }

            // Tell the AppWidgetManager to perform an update on the current
            // widget.
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

}
This AppWidgetProvider defines only the onUpdate() method, using it to create a PendingIntent that launches an Activity and attaches it to the widget's button using setOnClickPendingIntent(int, PendingIntent). It includes a loop that iterates through each entry in appWidgetIds, which is an array of IDs that identify each widget created by this provider. If the user creates more than one instance of the widget, then they all update simultaneously. However, only one updatePeriodMillis schedule is managed for all instances of the widget. For example, if the update schedule is defined to be every two hours, and a second instance of the widget is added one hour after the first one, then they're both updated on the period defined by the first, and the second update period is ignored. They both update every two hours, not every hour.

Note: Because AppWidgetProvider is an extension of BroadcastReceiver, your process isn't guaranteed to keep running after the callback methods return. See BroadcastReceiver for information about the broadcast lifecycle. If your widget setup process can take several seconds—such as when performing web requests—and you require that your process continues, consider starting a Task using WorkManager in the onUpdate() method. From within the task, you can perform your own updates to the widget without worrying about the AppWidgetProvider closing down due to an Application Not Responding (ANR) error.
See the ExampleAppWidgetProvider.java sample class for more details.

Receive widget broadcast intents
AppWidgetProvider is a convenience class. If you want to receive the widget broadcasts directly, you can implement your own BroadcastReceiver or override the onReceive(Context,Intent) callback. The intents you need to care about are the following:

ACTION_APPWIDGET_UPDATE
ACTION_APPWIDGET_DELETED
ACTION_APPWIDGET_ENABLED
ACTION_APPWIDGET_DISABLED
ACTION_APPWIDGET_OPTIONS_CHANGED
Create the widget layout
You must define an initial layout for your widget in XML and save it in the project's res/layout/ directory. Refer to Design guidelines for details.

Creating the widget layout is straightforward if you're familiar with layouts. However, be aware that widget layouts are based on RemoteViews, which doesn't support every kind of layout or view widget. You can't use custom views or subclasses of the views that are supported by RemoteViews.

RemoteViews also supports ViewStub, which is an invisible, zero-sized View you can use to lazily inflate layout resources at runtime.

Support for stateful behavior
Android 12 adds support for stateful behavior using the following existing components:

CheckBox

Switch

RadioButton

The widget is still stateless. Your app must store the state and register for state change events.

Example of shopping list widget showing stateful behavior
Figure 3. Example of stateful behavior.
Note: Always explicitly set the current checked state using RemoteViews.setCompoundButtonChecked, or you might encounter unexpected results when your widget is dragged or resized.
The following code example shows how to implement these components.

Kotlin
Java

// Check the view.
remoteView.setCompoundButtonChecked(R.id.my_checkbox, true)

// Check a radio group.
remoteView.setRadioGroupChecked(R.id.my_radio_group, R.id.radio_button_2)

// Listen for check changes. The intent has an extra with the key
// EXTRA_CHECKED that specifies the current checked state of the view.
remoteView.setOnCheckedChangeResponse(
R.id.my_checkbox,
RemoteViews.RemoteResponse.fromPendingIntent(onCheckedChangePendingIntent)
)
Provide two layouts: one targeting devices running Android 12 or higher in res/layout-v31, and the other targeting previous Android 11 or lower in the default res/layout folder.

Implement rounded corners
Android 12 introduces the following system parameters to set the radii of your widget's rounded corners:

system_app_widget_background_radius: the corner radius of the widget background, which is never larger than 28 dp.

system_app_widget_inner_radius: the corner radius of any view inside the widget. This is exactly 8 dp less than the background radius, to align nicely when using an 8 dp padding.

The following example shows a widget that uses system_app_widget_background_radius for the corner of the widget and system_app_widget_inner_radius for views inside the widget.

Widget showing radii of the widget background and views inside the widget
Figure 4. Rounded corners.
1 Corner of the widget.

2 Corner of a view inside the widget.

Important considerations for rounded corners

Third-party launchers and device manufacturers can override the system_app_widget_background_radius parameter to be smaller than 28 dp. The system_app_widget_inner_radius parameter is always 8 dp less than the value of system_app_widget_background_radius.
If your widget doesn't use @android:id/background or define a background that clips its content based on the outline—with android:clipToOutline set to true—the launcher automatically identifies the background and clips the widget using a rectangle with rounded corners of up to 16 dp. See Ensure your widget is compatible with Android 12.
For widget compatibility with previous versions of Android, we recommend defining custom attributes and using a custom theme to override them for Android 12, as shown in the following sample XML files:

/values/attrs.xml
/values/styles.xml
/values-31/styles.xml
More

<resources>
  <attr name="backgroundRadius" format="dimension" />
</resources>
