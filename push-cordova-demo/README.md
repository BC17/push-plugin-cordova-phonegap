Push Notification & Centili in-app Payment Plugin Demo Application for Cordova
====================================

Application made for demonstrational purposes of Infobip service plugins for Apache Cordova.

Requirements
------------

* Cordova (since version [at least] 3.3.0).
* Before cloning, make sure the directory contains the initialized Cordova project by `$ cordova create PushDemo com.infobip.cordova.demo PushDemo`.
* Installed plugins (org.apache.cordova.device, com.infobip.push.cordova & com.infobip.mpay) via `$ cordova plugins add <plugin>`
* Have platforms of your choice enabled. (`$ cordova platforms add <platform>`, `ios` and `android` supported by our push plugin, and `android` by mobile payment plugin)

You may copy the contents of "www" folder included in this repository over the cordova generated contents of "www" folder and run demo application.

Running
-------

To run this demo application with Cordova, go to directory containing this project and use Cordova CLI Tool:
	
	$ cordova run <platform>

Where `<platform> ::= "ios" | "android"`.

Owners
------

Framework Integration Team @ Belgrade, Serbia

© 2013-2014, Infobip Ltd.
