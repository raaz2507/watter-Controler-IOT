#include "wificonfig.h"

 /*📦 Save function */ 
void WiFiManager::saveWiFi(String ssid, String pass){
    prefs.begin("wifi", false);
    prefs.putString("ssid", ssid);
    prefs.putString("pass", pass);
    prefs.end();
}

/* 📥 Load function*/ 
bool WiFiManager::loadWiFi(String &ssid, String &pass){
    prefs.begin("wifi", true);

    ssid = prefs.getString("ssid", "");
    pass = prefs.getString("pass", "");

    prefs.end();

    return ssid.length() > 0;
}

/* 🔥 2. Router से connect करने का function */ 
bool WiFiManager::connectToWiFi(String ssid, String pass){
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

 /* 🔥 3. AP Mode (Hotspot) */ 
void WiFiManager::startAP(){
    WiFi.mode(WIFI_AP);
    WiFi.softAP("ESP_Setup", "12345678");

    Serial.println("📡 AP Mode Started");
    Serial.println(WiFi.softAPIP());
}


WiFiManager:: WiFiManager() {
    setup();
}

void WiFiManager :: setup(){
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



/* 4. Web page से SSID लेना */
// <form action="/save">
//   <input name="ssid" placeholder="WiFi Name">
//   <input name="pass" placeholder="Password">
//   <button type="submit">Connect</button>
// </form>
