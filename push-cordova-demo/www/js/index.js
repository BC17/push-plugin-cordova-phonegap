/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var app = {
    /// Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        //push
        app.init();
        //app.register();

        if (device.platform != "Android") {
            document.getElementById("overrideDefaultMessageHandlingToggle").setAttribute('style', 'display: none;');
            $('#btnCheckManifest').remove();
            $('#dataGetters').remove();    
            $('#tabPayment').remove();
            $('#liTabPayment').remove();
        } else {
            $('#btnGetDeviceId').hide();
        }
    },
    onNotifiedNotificationOpened: function () {
        app.appendToConsole("onNotifiedNotificationOpened!");
    },
    onNotifyNotificationOpenedFailed: function () {
        app.appendToConsole("onNotifyNotificationOpenedFailed");
    },
    /// Push Notification Listener
    notificationListener: function(event, notification){
        switch(event){
            case ("onNotificationReceived"): 
            // Tip: Don't try to print stringified JSON of notification to a page, all hell will break loose 
            // if you have some specific type of media notifications.
                app.appendToNotifications("<b>RECEIVED\n(" + notification.notificationId + ") :</b> \n" + notification.message);
                push.isDefaultMessageHandlingOverriden(function (data) {
                    if (data.developerHandleMessage) {
                        push.notifyNotificationOpened({
                            notificationId: notification.notificationId,
                            successCallback: app.onNotifiedNotificationOpened,
                            errorCallback: app.onNotifyNotificationOpenedFailed
                        });
                    };
                });
                push.isMediaNotification(notification, function (isMediaNotification) {
                    if (isMediaNotification) {
                        // var names = escape(encodeURI(JSON.stringify(notification.mediaData)));
                        // names = names.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
                        //app.appendToNotifications("<b>MEDIA:</b> \n" + notification.mediaData);

                        var customization = {
                            x: 20,
                            y: 20,
                            width: 240,
                            height: 320,
                            shadow: false,
                            radius: 5,
                            dismissButtonSize: 50,
                            foregroundColor: "#FF0000",
                            backgroundColor: "#AAAAAA"
                        };
                        // alert("b4 addMediaView");
                        push.addMediaView(notification, customization, function (error) {
                             alert(JSON.stringify(error));
                        });
                    } else {
                        app.appendToConsole(JSON.stringify(notification));
                    };
                });
            break;
            case ("onInvisibleNotificationReceived"): 
                alert(JSON.stringify(notification));
                app.appendToNotifications("<b>RECEIVED</b>(i): \n" + notification.message);
                push.notifyNotificationOpened(notification);
            break;    
            case ("onNotificationOpened"):
                app.appendToNotifications("<b>OPENED</b>: \n" + notification.message);
            break;       
            case ("onUnregistered"):
                app.appendToConsole("<b>UnRegister</b> - successful");
                app.hideModal();
            break; 
            case ("onRegistered"):
                app.appendToConsole("<b>Register</b> - successful");
                var locationToggle = document.getElementById("registrationToggle");
                locationToggle.style.backgroundColor = '#3b3';
                app.hideModal();
            break;
            case ("onError"):
                alert(notification);
                app.hideModal();
            break; 
            default:
                app.appendToConsole("other: " + event);
        }
    },

    /// Application init
    init: function(){
        console.log("Push Initialize");

        // remove jQuery mobile loading div (which is displayed on bottom of page)
        $('div.ui-loader').remove();
        $('#popupDialog').hide();

        // initialize push
        push.initialize(app.notificationListener);

        // TODO: On Android, set Builder Data
        // app.setBuilderData();
    },
    isLibraryInitializedCallback: function(data){
        console.log("Library is initialized: " + data.isLibraryInitialized);
    },

    /// Push Registration
    isRegisteredValue: false,
    isRegistered: function(){
        var retValue = false;
        push.isRegistered(function(arg) {
            console.log("isRegistered: " + arg.isRegistered);
            retValue = arg.isRegistered;
            isRegisteredValue = arg.isRegistered;
        });
        return retValue;
    },
    register: function(){
        push.isRegistered(function(arg) {
            if (arg.isRegistered) {
                app.hideModal();
                var locationToggle = document.getElementById("registrationToggle");
                locationToggle.style.backgroundColor = '#3b3';
                app.appendToConsole("Already registered!");
                return ;
            }
            app.appendToConsole("Registering...");

            var senderId1 = "", applicationId1, applicationSecret1;
            if (device.platform == 'Android') {
                senderId1 = "818732298055";
                applicationId1 = "714ff1743e17";
                applicationSecret1 = "02093350f437";
            } else {
                applicationId1 = "714ff1743e17";
                applicationSecret1 = "02093350f437";
            }
            push.register({
                // Production
                senderId: senderId1,
                applicationId: applicationId1,
                applicationSecret: applicationSecret1,

                registrationData: {
                    userId: "user",
                    channels: [
                    "news",
                    "infobip"
                    ]
                }
            });
        });
    },
    unregister: function(){
        var registered;
        push.isRegistered(function(data) {
            if (data.isRegistered) {
                push.unregister();
                app.appendToConsole('Unregistering...');
            } else {
                app.appendToConsole('Not registered. Not trying to unregister.');
                app.hideModal();
            };
            var locationToggle = document.getElementById("registrationToggle");
            locationToggle.style.backgroundColor = '#c33';
        });
    },
    /// Push Registration data
    getRegistrationData: function(){
        var btnGetRegData = document.getElementById("btnGetRegistrationData");

        push.getRegistrationData(app.registrationDataCallback);
    },
    registrationDataCallback: function(data){
        var btnGetRegData = document.getElementById("btnGetRegistrationData");

        app.hideModal();
        app.appendToConsole("Registration data: " + JSON.stringify(data));
    },

    /// Device Id
    getDeviceId: function() {
        push.getDeviceId(function (data) {
            app.appendToConsole("DeviceId = " + JSON.stringify(data));
        });
    },

    /// Push Notification Application Data
    getApplicationData: function(){
        push.getApplicationData(app.applicationDataCallback);
    },
    applicationDataCallback: function(data){
        app.appendToConsole("Sender ID: " + data.senderId + "; " + "Device ID: " + data.deviceId);
        app.appendToConsole("Application ID: " + data.applicationId + "; " + "Application Secret: " + data.applicationSecret);
        app.hideModal();
    },

    /// Push Location
    enableLocation: function(){
        push.enableLocation();
        app.appendToConsole("Location enabled");
        var locationToggle = document.getElementById("locationToggle");
        locationToggle.style.backgroundColor = '#3b3';
    },
    disableLocation: function(){
        push.disableLocation();
        app.appendToConsole("Location disabled");
        var locationToggle = document.getElementById("locationToggle");
        locationToggle.style.backgroundColor = '#c33';
    },
    enableBackLocation: function(){
        push.setBackgroundLocationUpdateModeEnabled(true);
        app.appendToConsole("Background Location enabled");
        var locationToggle = document.getElementById("locationBackToggle");
        locationToggle.style.backgroundColor = '#3b3';
    },
    disableBackLocation: function(){
        push.setBackgroundLocationUpdateModeEnabled(false);
        app.appendToConsole("Background Location disabled");
        var locationToggle = document.getElementById("locationBackToggle");
        locationToggle.style.backgroundColor = '#c33';
    },
    setLocationUpdateTime: function() {
        var newUpdTime = $('#inLocationUpdateTime').val();
        var errorOccurred = false;
        push.setLocationUpdateTimeInterval(newUpdTime, function (error) {
            errorOccurred = true;
            app.appendToConsole("setLocationUpdateTimeInterval - ERROR: " + error);
        });
        if (! errorOccurred) {
            app.appendToConsole("setLocationUpdateTimeInterval - SUCCESS");
        };
    },

    /// Push Debug Mode
    isDebugModeEnabled: function(arg){
        console.log("Debug mode is enabled: " + arg.debugMode);
    },
    setDebugModeEnabled: function(ind){
        push.setDebugModeEnabled(ind);
        app.appendToConsole("Debug mode set to " + ind);
        var debugModeToggle = document.getElementById("debugModeToggle");
        if (ind) {
            debugModeToggle.style.backgroundColor = '#3b3';
        } else {
            debugModeToggle.style.backgroundColor = '#c33';
        }
    },

    /// Check Manifest
    checkManifest: function() {
        // TODO: 
        // Propagate success method.
        push.checkManifest(function(errorMessage){
            app.appendToConsole("Check Manifest - ERROR: " + errorMessage);
        });        
    },

    /// User Data
    changeUserId: function() {
        var inNewUserId = $('#inNewUserId').val();

        push.setUserId(inNewUserId, function (data) {
            app.appendToConsole("changeUserId - SUCCESS. New user id should be: " + inNewUserId);
            app.getUserId();
            app.hideModal();
        }, function (data) {
            app.appendToConsole("changeUserId - Error: " + JSON.stringify(data) + " | " + data);
            app.hideModal();
        });
    },
    getUserId: function() {
        push.getUserId(function (data) {
            app.appendToConsole("User = " + JSON.stringify(data));
        });
    },

    /// Push Channels
    getRegisteredChannels: function(){
        app.appendToConsole("Getting registered channels...");
        push.getRegisteredChannels(function (channels) {
            app.appendToConsole("<b>Channels:</b> " + JSON.stringify(channels));
            app.hideModal();
        }, function (error) {
            app.appendToConsole("Push - Getting channels failed due to: " + error);
            app.hideModal();
        });
    },
    subscribeToChannel: function() {
        var newChannel = document.getElementById('inSubscribeToChannel').value;
        push.registerToChannels({
            'channels' : [newChannel],
            'removeExistingChannels' : false
        });
    },
    subscribeToChannelCallback: function(event, data) {
        switch (event) {
            case ("onChannelsRegistered"):
                app.appendToConsole("Successfully (un)registered to channel(s).");
                app.hideModal();
            break;
            case ("onChannelRegistrationFailed"):
                app.appendToConsole("Failed to register to channel due to: " + data);
                app.hideModal();
            break;
            default:
                alert(event + " : " + data);
                app.hideModal();
        };
    },
    unsubscribeFromAllChannels: function() {
        push.registerToChannels({
            'channels' : [ ],
            'removeExistingChannels' : true,
            'registrationCallback' : 'app.subscribeToChannelCallback'
        });
    },

    /// Push - Get Unreceived Notifications
    getUnreceivedNotifications: function(){
        push.getUnreceivedNotifications(function(array) {
            if (typeof array !== 'undefined' && array.length > 0) {
                app.appendToNotifications("<b>(UN)RECEIVED: </b>\n" + JSON.stringify(array));
            } else {
                app.appendToNotifications("<b>(UN)RECEIVED: NONE</b>\n");
            }
            app.hideModal();
        }, function(error) {
            app.appendToConsole("(UN)Receiving failed due to: " + error);
            app.hideModal();
        });
    },

    /// Override Default Push Message Handling (Android)
    overrideDefaultMessageHandling: function(overriden) {
        push.overrideDefaultMessageHandling(overriden);
        app.appendToConsole("Default message handling now set to: <b>" + overriden + "</b>");
    },
    switchDefaultMessageHandling: function() {
        push.isDefaultMessageHandlingOverriden(function(data){
            push.overrideDefaultMessageHandling(!data.developerHandleMessage);
            if (data.developerHandleMessage) {
                app.setBuilderData();
            }
        });
    },

    /// Push Notification Builder customization (Android)
    setBuilderData: function(){
        if (device.platform != 'Android') {
            app.appendToConsole("Customization via builder can be done on Android only!");
            return ;
        };

        var data = {
            tickerText: "Infobip Cordova Demo",
            applicationName: "Infobip Cordova Demo App",
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
        };
        push.setBuilderData(data, function () {
            app.appendToConsole("Successfuly set Push Notification Builder data!");
        }, function (error) {
            app.appendToConsole(JSON.stringify(error));
        });
    },
    getBuilderData: function(){
        if (device.platform != 'Android') {
            app.appendToConsole("Customization via builder can be done on Android only!");
            app.hideModal();
            return ;
        };

        push.getBuilderData(function(data){
            app.appendToConsole(JSON.stringify(data));
            app.hideModal();
        }, 
        function(){
            app.hideModal();
        });
    },

/**
 *
 *  Centili Payments
 *
 *
 **/
    startPayment: function() {
        centili.setDebugModeEnabled(true, function(){}, function(){});
        centili.startPayment({
            'packageIndex': -1,
            'apiKey': '28550ec26491d4ed1b1de6fd3fe2b92a'
        },
        app.successfulPayment,
        app.unSuccessfulPayment);
        // TODO: get callback for different payment statuses
    },
    successfulPayment: function(purchaseResponse) {
        if (purchaseResponse.status == "onPurchaseSuccess") {
            app.appendToConsole("<b><i>Purchase successful!</i></b> itemAmount: " + 
                purchaseResponse.itemAmount + ";");
        }
        if (purchaseResponse.status == "onPurchasePending") {
            app.appendToConsole("<i>Purchase pending</i>");
        }
        app.hideModal();
    },
    unSuccessfulPayment: function(purchaseResponse) {
        if (purchaseResponse.status == "onPurchaseFailed") {
            app.appendToConsole("<b>Purchase Failed</b>");
        }
        if (purchaseResponse.status == "onPurchaseCanceled") {
            app.appendToConsole("<i>Purchase Cancelled</i>");
        }
        if (purchaseResponse.status == "error") {
            app.appendToConsole("<b>Purchase ERROR!</b> - " + purchaseResponse.message);
        }
        app.hideModal();
    },


/**
 *
 *  Other
 *
 *
 **/
    // Modal dialog (Working... Please wait...)
    showModal: function() {
        var modalElement = $('#myModal');
        modalElement.modal('show');
    },
    hideModal: function() {
        // get our modal element
        var modalElement = $('#myModal');
        // when modal is hidden, set no action on next modal show (cancel next line)
        modalElement.on('hidden.bs.modal', function (e) {
            modalElement.on('shown.bs.modal', function (e) {
            });
        });
        // if modal is not yet shown, set it to hide immediately as it's shown
        modalElement.on('shown.bs.modal', function (e) {
            modalElement.modal('hide');
        });
        // try to hide modal
        modalElement.modal('hide');
    },
    // Write to Notifications
    appendToNotifications: function(log) {
        var notificationsElement = document.getElementById("notifications");
        notificationsElement.innerHTML = log + "<br />" + notificationsElement.innerHTML;
    },
    // Write to Console
    appendToConsole: function(log){
        var consoleElement = document.getElementById("console");
        consoleElement.innerHTML = log + "<br />" + consoleElement.innerHTML;  
    }
};
