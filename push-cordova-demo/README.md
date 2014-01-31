Push Notification Plugin Demo Application for Cordova
====================================

Application made for demonstrational purposes of Infobip services plugins for Apache Cordova.

Requirements
------------

* Cordova (since version [at least] 3.3.0).
* Before cloning, have the directory contain initialized cordova project by `$ cordova create com.infobip.pushHello HelloCordova`.
* Installed plugins (com.infobip.push.cordova & com.infobip.mpay) via `$ cordova plugins add <plugin>`
* Have platforms of your choice enabled. (`$ cordova platforms add <platform>`, `ios` and `android` supported by our push plugin, and `android` by mobile payment plugin)


Running
-------

To run this demo application with Cordova, go to directory containing this project and use Cordova CLI Tool:
	
	$ cordova run <platform>

Where `<platform> ::= "ios" | "android"`.

Owners
------

Framework Integration Team @ Belgrade, Serbia

© 2013-2014, Infobip Ltd.