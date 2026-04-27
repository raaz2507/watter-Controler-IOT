#ifndef WIFICONFIG_H
#define WIFICONFIG_H

#include <WiFi.h>
// #include <ESPAsyncWebServer.h>
#include <Preferences.h>

// #include <AsyncTCP.h>


class WiFiManager{
  private:
		Preferences prefs;
   
		bool loadWiFi(String &ssid, String &pass);
		bool connectToWiFi(String ssid, String pass);
		void startAP();
	
	public:
    WiFiManager(); //constroctor Diclaration
		void saveWiFi(String ssid, String pass);
		void setup();
};


// void setup();

#endif