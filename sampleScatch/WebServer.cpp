#include "WebServer.h"

// #include "wificonfig.h"
AsyncWebServer server(80);

WiFiManager wifi;
// /* 🔥 5. Server route (data receive)*/
void registerRoutes() {

  server.on("/save", HTTP_GET, [](AsyncWebServerRequest *request){

      String ssid = request->getParam("ssid")->value();
      String pass = request->getParam("pass")->value();

      wifi.saveWiFi(ssid, pass);

      request->send(200, "text/plain", "Saved! Restarting...");

      delay(2000);
      ESP.restart();
  });
}