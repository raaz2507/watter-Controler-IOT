#ifndef WEBSERVER_H
#define WEBSERVER_H

#include "wificonfig.h"
#include <ESPAsyncWebServer.h>

extern AsyncWebServer server; //its meain "server" defien outside

inline WiFiManager wifi;
// /* 🔥 5. Server route (data receive)*/
inline void registerRoutes() {

    server.on("/save", HTTP_GET, [](AsyncWebServerRequest *request){

        if (request->hasParam("ssid") && request->hasParam("pass")) {
            String ssid = request->getParam("ssid")->value();
            String pass = request->getParam("pass")->value();

            // WiFi credentials save karein
            wifi.saveWiFi(ssid, pass);

            // Response bhejein pehle
            request->send(200, "text/plain", "Credentials Saved! ESP will restart in 2 seconds...");

            // Bina delay ke restart karne ke liye ek chota logic (optional but safe)
            // Ya phir niche wala simple restart use karein:
            Serial.println("Restarting ESP...");
            
            // Async server mein restart ke liye delay se behtar hai yield ya timer use karna
            // Lekin agar aapko simple rakhna hai toh:
            delay(1000); 
            ESP.restart();
        } else {
            request->send(400, "text/plain", "Missing Parameters");
        }
    });
}
#endif