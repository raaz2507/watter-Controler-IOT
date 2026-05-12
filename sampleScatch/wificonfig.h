#ifndef WIFICONFIG_H
#define WIFICONFIG_H

#include <WiFi.h>
// #include <ESPAsyncWebServer.h>
#include <Preferences.h>

// #include <AsyncTCP.h>


class WiFiManager{
  private:
		Preferences prefs;
   
		bool loadWiFi(String &ssid, String &pass){
			prefs.begin("wifi", true);

			ssid = prefs.getString("ssid", "");
			pass = prefs.getString("pass", "");

			prefs.end();

			return ssid.length() > 0;
		}
		
		bool connectToWiFi(String ssid, String pass){
			WiFi.mode(WIFI_STA);
			WiFi.begin(ssid.c_str(), pass.c_str());

			Serial.print("Connecting...");

			int retry = 0;
			while (WiFi.status() != WL_CONNECTED && retry < 20){
				delay(500);
				Serial.print(".");
				retry++;
			}

			if(WiFi.status() == WL_CONNECTED){
				Serial.println("\n✅ Connected!");
				Serial.println(WiFi.localIP());
				return true;
			}

			Serial.println("\n❌ Failed");
			return false;
		}
		void startAP(){
			WiFi.mode(WIFI_AP);
			WiFi.softAP("ESP_Setup", "12345678");

			Serial.println("📡 AP Mode Started");
			Serial.println(WiFi.softAPIP());
		}
	
	public:
		//constroctor Diclaration
		WiFiManager() {
			setup();
		}
		void saveWiFi(String ssid, String pass){
			prefs.begin("wifi", false);
			prefs.putString("ssid", ssid);
			prefs.putString("pass", pass);
			prefs.end();
		}
		void setup(){
			String ssid, pass;

			if(loadWiFi(ssid, pass)){
				if(connectToWiFi(ssid, pass)){
					Serial.println("🚀 Running in STA mode");
				} else {
					startAP();
				}
			} else {
				startAP();
			}
		}
};


// void setup();

#endif