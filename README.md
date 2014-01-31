Infobip Push Notification Plugin for Cordova
====================================

Infobip Push is a service by Infobip Ltd. ([Infobip Push](https://push.infobip.com)) providing it's users ability to send push notifications to various device types with possibilities of rich media push, geographical targeting areas, delivery report, and many more.

Installation
------------

To install plugin to your Cordova project use Cordova CLI Tool:
	
	$ cordova plugin add com.infobip.push.cordova

Requirements
------------

* `Android™`
	* Set minimal required Android SDK version to 8 because GCM push is enabled since that Android OS version.
* `iOS™`
	* Tested on iOS 6 and 7

Basic Usage
-----------

### Initialization

Once you've added plugin to your project, you will be able to use it in javascript code by `push`.

First thing you should do is initialize push plugin with `push.initialize(notificationListenerCallbackName)`. You provide this function with the name (string) of your callback function which should have signature `function(event, data)`. First parameter `event` (string) will take following values:

* `onNotificationReceived` - when a device receives a push notification from Infobip Push Service. In this case, `data` argument of this function will be JSON object representing notification.
* `onInvisibleNotificationReceived` - when a device receives a push notification from Infobip Push Service when application TODO. In this case, `data` argument of this function will be JSON object representing notification.
* `onNotificationOpened` - when an user opens received notification from notification bar. In this case, `data` argument of this function will be JSON object representing notification.
* `onUnregistered` - when an application successfully unregisters from Infobip Push Service. In this case, `data` argument plays no significant role.
* `onRegistered` - when an application successfully registers to Infobip Push Service. In this case, `data` argument plays no significant role.
* `onError` - when an error occurs. This time, `data` argument will be error code. Error codes are listed below in section named "Error Codes".

#### Example of usage:

This code will initialize Push Notifications with `notificationListener` callback listener:
 
	push.initialize(notificationListener);
	

Sample implementation of `notificationListener` callback listener:

	notificationListener: function(event, notification){
        switch(event){
            case ("onNotificationReceived"):
                // TODO your code here
                break;
            case ("onInvisibleNotificationReceived"):
                // TODO your code here
                break;
            case ("onNotificationOpened"):
                // TODO your code here
                break;
            case ("onUnregistered"):
                // TODO your code here
                break;
            case ("onRegistered"):
                // TODO your code here
                break;
            case ("onError"):
                // TODO your code here
                break;
            default:
                // TODO your code here
                break;
        }
    }

### Registration

You need only one more function to make the magic happen. It's `push.register(regData);`. It's first argument is a JSON object containing mandatory:

* `applicationId` - Application UID from Infobip Push Portal.
* `applicationSecret` - Application Secret from Infobip Push Portal.
* `senderId` - represents your Google Project number, obtained from the Google API Console (mandatory and specific for Android)

and optional:

* `registrationData` - JSON object containing:
	* `userId` - User ID which you can use for selectional targeting of push notifications from portal. If omitted, it will be random hash.
	* `channels` - JSON array of strings representing channel names to which application will register.

#### Example of registration object

	regData: {
	    applicationId: "<YOUR-APPLICATION-ID>",
	    applicationSecret: "<YOUR-APPLICATION-SECRET>",
	    senderId: "<YOUR-SENDER-ID>",	    
	
	    registrationData: {
	        userId: "<SOME-USER-ID>",
	        channels: 
	        [
	            "news",
	            "sport",
	            "infobip"
	        ]
	    }
	}


		
That was core of your application's interaction with our plugin. Other than that, there are many functions you can use, and we will list them all in next chapter.

Advanced Usage
--------------

#### Notification
Received notification has next form:

	{
	    "notificationId":"<52d916a...00006e7>",
	    "message":"<Some message>",
	    "aditionalInfo":
	    {
	        "key1":"value1",
	        "key2":"value2"
	    },
	    "mediaData":"",
	    "url":"<http://google.com>",
	    "title":"<Message title>",
	    "sound":true,
	    "lights":false, // Android only
	    "vibrate":false, // Android only
	    "mimeType":"text/html",
	    "badge":"10" // iOS only
	}

Depending of operating system, some fields exist or not.

* `lights` and `vibrate` are only available on Android.
* `badge` is only available on iOS


#### UserId

Overrides previously defined userID with the new one:

	push.setUserId(newUserId, successCallback, errorCallback),
	
	successCallback: function(), 
	errorCallback: function(errorCode),
	
Error callback accepts error codes described in chapter Error Codes 

	
Get current userId (`data` is object that contains field `userId`):
	
	push.getUserId(successCallback);
	successCallback: function(data);
	
`data` parameter is like following:

	{
		userId: <USER-ID>
	}	


#### DebugMode

To get logs, set debug mode enabled to `true`:
	
	push.setDebugModeEnabled(true, logLevel);
	push.setDebugModeEnabled(true);

`logLevel` is integer that can take values form 0 to 4, and works only on iOS. 
It is possible to set it on Android too, but it does not affect on result.

Check is debug	mode set or not with next code:
	
	push.isDebugModeEnabled(successCallback),
	successCallback: function(data)
	
`data` parameter is like following:

	{
		debugMode: true
	}	


#### Channels
If the user is already registered, subscribe him/her to channels by using 
	
	push.registerToChannels(args, successCallback, errorCallback);
	
`arguments` is JSON object like following:

	{
	    channels: [
	        "channel1",
	        "channel2",
	        "channel3"
	    ],
	    removeExistingChannels: true
	}

	successCallback: function(),
	errorCallback: function(errorCode)

User will be registered to provided channels, with the new channels created on Infobip Push service if you haven't already created them per application. Once you set `removeExistingChannels` field to true, existing channels on the Push service will be deleted, and a list of new channels will replace them. If false, existing channels will stay intact and user will be registered to newly provided list of channels. Monitor channel registration success by providing callback functions.

Channels that you registered your user to are saved on the Infobip Push service. You can obtain them using:
 
	push.getRegisteredChannels(getRegisteredChannelsCallback, errorCallback);
	
Callback that accepts obtained channels should look like this:
	
	getRegisteredChannelsCallback: function(channels)
	
and error callback is like following:

	errorCallback: function(error)
	
	
`channels` is JSON list of obtained channels
`error` is one of following error codes in table below
	
Error callback accepts error codes described in chapter Error Codes 


#### Registration
`push.unregister();` - unregister from Infobip Push Notification service. `onUnregistered` event of notification listener callback (set in `push.initialize`) will be fired upon successful unregistration.

checks whether application is registered or not to Infobip Push service

`push.isRegistered(isRegisteredClb);`

`isRegisteredClb` should look like this:

	isRegisteredClb: function(response);
	
`response` parameter is like following:

	{
		isRegistered: true
	}	

    
Callback function has one argument (JSON object) which has field `isRegistered` of boolean type.
Alternative this should take next form: 

	push.isRegistered(function(response){alert(response.isRegistered);});
            

#### Unreceived
To get a list of unreceived push notifications call this function:

	push.getUnreceivedNotifications(unreceivedNotificationsCallback, errorCallback);
	
`unreceivedNotificationsCallback` is callback function that accept one parameter `notificationArray` (JSONArray of notification objects) and could look like this:

    unreceivedNotificationsCallback: function(notificationArray)
    
and  `errorCallback` like folowing, where error represents one of error codes from table below: 
	
	errorCallback: function(error)

| Error Code| Description 					|
| ---------:| -----------------------------| 
| 1			| INTERNET_NOT_AVAILABLE		|
| 2 		| PUSH_SERVICE_NOT_AVAILABLE	|
| 4 		| USER_NOT_REGISTERED			|
| 12 		| OPERATION_FAILED				|
| 512 		| LIBRARY_NOT_INITIALIZED		|


#### DeviceId
Device ID is unique device identifier in the Infobip Push system.
It can be used to send push notifications to a specific user. It will be created only once. To get it, use next function:
	
	push.getDeviceId(successCallback)
	
`successCallback` accepts one parameter (JSON Object) that contain field `deviceId`. Example of usage is next: 

	successCallback: function(response){
    	alert(response.deviceId);
	});
	
#### Notify Notification Opened

To notify Infobip Push Service, that notification is opened call

	notifyNotificationOpened(args)

`args` parameter is JSON Object like following:

	{
	    notificationId: "<NOTIFICATION-ID>",
	    successCallback: function(){},
	    errorCallback: function(error){}
	}

On iOS, notifying that notification is opened in not possible to do automatically, so you need to call this function manually.

Also, on Android, when application receive invisible notification (see `overrideDefaultMessageHandling`), you need to manually call `notifyNotificationOpened` function



#### AndroidManifest (Android only)
To make sure that nothing required is missing in your Android manifest file, use next method. Any error will be logged, so please check your LogCat to verify that manifest is properly configured.

	checkManifest(successCallback, errorCallback)
	
Note: Debug mode has to be enabled to view log.

#### Application Data (Android only)

To get application data call next function:
	
	getApplicationData(successCallback)
	
`successCallback` accepts one parameter (JSON Object), that should look like following: 
	
	successCallback: function(data)
	
`data` param is like following:

	{
	     senderId: "<SENDER-ID>",
	     deviceId: "<DEVICE-ID>",
	     applicationId: "<APPLICATION-ID>",
	     applicationSecret: "<APPLICATION-SECRET>",
	}
	
#### Builder Data (Android only)

To get builder data call next function:

	getBuilderData(successCallback, errorCallback)

`successCallback` accepts one parameter (JSON Object), that should look like following: 
	
	successCallback: function(data)

To set builder data call next function:

	setBuilderData: function(data, successCallback, errorCallback);
	
`data` param in both cases should look like following:

    {
        tickerText: "Infobip Push Demo",
        applicationName: "Infobip Push Demo App",
        sound: -1,
        vibration: -1,
        light: -1,
        vibrationPattern: [100, 100],
        lightsColor: 10201,
        lightsOnOffMS: {
            on: 100,
            off: 200
        },
        quietTime: {
            startHour: 23,
            startMinute: 30,
            endHour: 8,
            endMinute: 45
        }
    }


* `tickerText` represents text to scroll across the screen when this item is added to the status bar.
* `applicationName` represents application name shown in the notification drawer as a title if the title isn't sent via push notification.  
* `sound`, `vibration` and `light` can take one of tree possible values
	* -1 means UNSET
	*  0 means DISABLED
	*  1 means ENABLED 
* `vibrationPattern` Pass in an array of ints that are the durations for which to turn on or off the vibrator in milliseconds.
* `lightsColor` Sets the color of the LED light. 
* `lightsOnOffMS` Sets the number of milliseconds for the LED to be on and off while it's flashing.
* `quietTime` Quiet time is an interval set with `startHour`, `startMinute`, `endHour`, `endMinute` that determines the time when the sound, vibration and flashing lights won't perform on the notification receival. Hours are in 24-hour format.

#### Override Default Message Handling (Android only)

Use next function to override the default message handling, where `shouldOverride` value is set to true:

	overrideDefaultMessageHandling(shouldOverride)

Overriding default notification handling means that:

* the plugin won't display the received notification
* to track the notification opened statistics you will have to manually call the `notifyNotificationOpened(args)` function

#### Remove Saved Builder Data (Android only)

To remove saved builder data call next function:

	push.removeSavedBuilderData();

#### Set Quiet Time Enabled (Android only)

Provide your user the time when sound, vibration and flashing lights won't perform by implementing the quiet time.

	push.setQuietTimeEnabled(ind); 

where `ind` is boolean that indicates weather you want or not to enable quiet time

Quiet time interval is set with the start hour, start minute, end hour, end minute parameters, in `data` object passed to `setBuilderData`,  where hour is in 24-hour time format.
	

<!--Using this function, you can override default message handling on your Android. Combined with `setBuilderData`, you can highly customize your application's notifications. TODO: give link or extensive description of how this can be done
-->

#### Timezone offset

Automatic timezone offset updates are enabled by default. The value of the timezone offset is the time difference in minutes between GMT and user's current location. Information on timezone offset for each user can be useful when sending a scheduled notification for which you want each user to receive it in the specific time according to the timezone they are in.

You can manually set timezone offset in minutes using following function:
	
	push.setTimezoneOffsetInMinutes(minutes);
	
If you manually set timezone offset then the default automatic timezone offset updates will be disabled. Also if you enable automatic timezone offset updates again, then the manually timezone offset value will be overridden by automatic updates. To enable automatic timezone offset updates you should use function:

	push.setTimezoneOffsetAutomaticUpdateEnabled(ind);
	
`ind` is boolean value;

#### Badge number (iOS Only)

iOS will automatically set the application badge to the `badge` number received in the push notification. Your responsibility is to handle the badge number within the app according to unread notifications count. Use this code anywhere in the app to set the badge number:
	
	push.setBadgeNumber(num);
	

#### Dismiss All Notifications (iOS Only)
To dismiss all notifications from notification bar, connected to your application, call next function:
	
	push.cancelAllNotifications();
	
#### Media View
Media View is used to show media content from the media push notification. Media content referes to multimedia content (image, video, audio) wrapped inside HTML tags. Using Infobip Media View is optional which means that at any time you can create your own Media View where you will show the media content from the media push notification. Infobip Media View offers basic functionality of showing media content inside rounded view with the default shadow around it. View also has a dismiss button through which the user can dismiss the Media View. Any of these fields can be changed according to your application needs, so for instance you can change dismiss button; enable or disable the default shadow or even change corner radius size of the view.

To use Infobip Media View call function below:

	push.addMediaView(notification, customization, errorCallback);

`notification` is media notification received from Infobip Push server,
`customization` is JSON Object to customize media view outlook and contains next fields:
	
	{
		x: 10,
		y: 20,
		width: 100,
		height: 200,
		shadow: true,
		radius: 15,
		dismissButtonSize: 20,
		foregroundColor: "#ffffff",
		backgroundColor: "#000000"
	}

`errorCallback` is callback function that accept one parameter(`errorCode`)

	errorCallback: function(errorCode);


### Location	

In Push library version 1.1.1 we introduced our own location service that acquires user's latest location and sends it periodically to the Infobip Push service in the background. By using this service, your location can be retrieved with all the location providers: GPS, NETWORK or PASSIVE provider.

Start Push location service using `push.enableLocation()` to track user's location and stop it with `push.disableLocation()` method. Once started, Push location service sends location updates to the Infobip Push service in the default interval, or in the interval specified using `push.setLocationUpdateTimeInterval(interveal, errorClb)`, where you define int value in minutes.


To enable location use function below:

	push.enableLocation();
	
and for disable sending location to Push Service use next function:

	push.disableLocation();

To check, is location enabled or not use
	
	isLocationEnabled(successClb)
	successClb: function(data)
	
Data parameter is like following:

	{
		isLocationEnabled: true
	}	

Success callback accepts parameter (JSON Object), that has boolean field `isLocationEnabled`.
	
#### Time Interval

To change default time interval (15 min), use next function:
	
	push.setLocationUpdateTimeInterval(interveal, errorClb);
	errorClb: function(errorMessage);
	
Getting current time interval is possible with following function:

	push.getLocationUpdateTimeInterval(successClb);
	successClb: function(data);
	
Data parameter is like following:

	{
		getLocationUpdateTimeInterval: 25 //minutes
	}


#### Background Location Update (iOS only)

On iOS, location updates works only when the application is active. Background location updates are disabled by default. To enable background location updates, use the following function:

	push.setBackgroundLocationUpdateModeEnabled(ind)

where `ind` is boolean value.

To check, is background location update enabled or not use next function:
	
	push.backgroundLocationUpdateModeEnabled(successClb);
	successClb: function(data)
	
Data parameter is like following:

	{
		isBackgroundLocation: true
	}	
	
 
Error Codes
-----------	 
		 	 
<table><tr>
    <th>
        Reason
    </th>
    <th>
        Performed operation
    </th>
    <th>
        Description
    </th>
    <th>
        Value
    </th>
</tr>
<tbody>
<tr>
    <td>
        OPERATION_FAILED
    </td>
    <td>
        <code>register</code>
        <code>unregister</code>
        <code>registerToChannels</code>
        <code>getRegisteredChannels</code>
        <code>notifyNotificationOpened</code>
        <code>getUnreceivedNotifications</code>
        <code>saveNewUserId</code>
    </td>
    <td>
        Performed operation failed
    </td>
    <td>
        12
    </td>
</tr>
<tr>
    <td>
        INTERNET_NOT_AVAILABLE
    </td>
    <td>
        <code>register</code>
        <code>unregister</code>
        <code>registerToChannels</code>
        <code>getRegisteredChannels</code>
        <code>notifyNotificationOpened</code>
        <code>getUnreceivedNotifications</code>
        <code>saveNewUserId</code>
    </td>
    <td>
        Internet access is unavailable
    </td>
    <td>
        1
    </td>
</tr>
<tr>
    <td>
        PUSH_SERVICE_NOT_AVAILABLE
    </td>
    <td>
        <code>register</code>
        <code>unregister</code>
        <code>registerToChannels</code>
        <code>getRegisteredChannels</code>
        <code>notifyNotificationOpened</code>
        <code>getUnreceivedNotifications</code>
        <code>saveNewUserId</code>
    </td>
    <td>
        Infobip Push service is currently unavailable
    </td>
    <td>
        2
    </td>
</tr>
<tr>
    <td>
        USER_NOT_REGISTERED
    </td>
    <td>
        <code>unregister</code>
        <code>registerToChannels</code>
        <code>getRegisteredChannels</code>
        <code>notifyNotificationOpened</code>
        <code>getUnreceivedNotifications</code>
        <code>saveNewUserId</code>
    </td>
    <td>
        User is not registered for receiving push notifications
    </td>
    <td>
        4
    </td>
</tr>
<tr>
    <td>
        GCM_ACCOUNT_MISSING
    </td>
    <td>
        <code>register</code>
    </td>
    <td>
        Google account is missing on the phone
    </td>
    <td>
        8
    </td>
</tr>
<tr>
    <td>
        GCM_AUTHENTICATION_FAILED
    </td>
    <td>
        <code>register</code>
    </td>
    <td>
        Authentication failed – your user's Google account password is invalid
    </td>
    <td>
        16
    </td>
</tr>
<tr>
    <td>
        GCM_INVALID_SENDER
    </td>
    <td>
        <code>register</code>
    </td>
    <td>
        Invalid GCM sender ID
    </td>
    <td>
        32
    </td>
</tr>
<tr>
    <td>
        GCM_PHONE_REGISTRATION_ERROR
    </td>
    <td>
        <code>register</code>
    </td>
    <td>
        Phone registration error occurred
    </td>
    <td>
        64
    </td>
</tr>
<tr>
    <td>
        GCM_INVALID_PARAMETERS
    </td>
    <td>
        <code>register</code>
    </td>
    <td>
        Invalid parameters are sent
    </td>
    <td>
        128
    </td>
</tr>
<tr>
    <td>
        GCM_SERVICE_NOT_AVAILABLE
    </td>
    <td>
        <code>register</code>
    </td>
    <td>
        GCM service is unavailable
    </td>
    <td>
        256
    </td>
</tr>
<tr>
    <td>
        LIBRARY_NOT_INITIALIZED
    </td>
    <td>
        <code>register</code>
        <code>unregister</code>
        <code>registerToChannels</code>
        <code>getRegisteredChannels</code>
        <code>notifyNotificationOpened</code>
        <code>getUnreceivedNotifications</code>
        <code>saveNewUserId</code>
    </td>
    <td>
        Library is not initialized
    </td>
    <td>
        512
    </td>
</tr>
<tr>
    <td>
        USER_ALREADY_REGISTERED
    </td>
    <td>
        <code>register</code>
    </td>
    <td>
        User is already registered
    </td>
    <td>
        1024
    </td>
</tr>
</tbody>
</table>

Owners
------

Framework Integration Team @ Belgrade, Serbia

*Android is a trademark of Google Inc.*

*IOS is a trademark of Cisco in the U.S. and other countries and is used under license.*

© 2013-2014, Infobip Ltd.