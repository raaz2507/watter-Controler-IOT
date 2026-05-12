#ifndef MAIN_H
#define MAIN_H

#include <Arduino.h>           // Core Arduino functionality (GPIO, timing, Serial, etc.)		
#include <ESPAsyncWebServer.h>    // Asynchronous HTTP and WebSocket server built on AsyncTCP
#include <AsyncTCP.h>							// Non-blocking TCP library for asynchronous networking

#include <WiFi.h>                 // ESP32 Wi-Fi management (AP and Station modes)

#include "LittleFS.h"							// Flash-based file system for serving website files

/*
	--- Constants & Config ---
	- SSID, password, channel, visibility, and max clients 
*/
#define AP_SSID "P4"
#define AP_PASS "12344321"
#define AP_CHANNEL 1
#define AP_HIDDEN false
#define AP_MAX_CON 8

// 🔥 Debug: list all files
#define DEBUG_FS 1

//Network Config
inline IPAddress local_IP (192,168,4,18);
inline IPAddress gateway (192, 168,4, 9);
inline IPAddress subnet (255, 255, 255 , 0);

// Server objects
extern AsyncWebServer server;
// Create a WebSocket object
inline AsyncWebSocket ws("/ws");

// --- Functions (Using 'inline' to prevent linking errors) ---

inline void sayHello(){
	Serial.println("Hello neha");
}

inline void checkLittleFSSpace() {
    if (!LittleFS.begin(true)) {
        Serial.println("❌ LittleFS Mount Failed");
        return;
    }

    size_t total = LittleFS.totalBytes(); // Total space allocated for LittleFS
    size_t used = LittleFS.usedBytes();   // Space currently occupied by files

    Serial.println("\n--- LittleFS Storage Info ---");
    Serial.printf("Total Space: %d bytes (%.2f KB)\n", total, total / 1024.0);
    Serial.printf("Used Space:  %d bytes (%.2f KB)\n", used, used / 1024.0);
    Serial.printf("Free Space:  %d bytes (%.2f KB)\n", total - used, (total - used) / 1024.0);
    Serial.println("-----------------------------\n");
}

//Initialize LittleFS
inline void initLittleFS(){
	if (!LittleFS.begin(true)){  // 🔥 auto format if fail
		Serial.println("❌ LittleFS Mount Failed");
		return;
	}
	Serial.println("✅ LittleFS Mounted");
  
  checkLittleFSSpace();

	// 🔍 Check file existence first
	if(!LittleFS.exists("/index.html")){
			Serial.println("❌ index.html missing");
	}else{
		Serial.println("✅ index.html found");

		File file = LittleFS.open("/index.html", "r");
		if (file){
			Serial.println( "📄 File size: " + String(file.size()) );
			file.close();
		}else {
					Serial.println("❌ Failed to open index.html");
		}	
	}

	// 🔥 Debug: list all files

		#if DEBUG_FS
			Serial.println("📂 Files in LittleFS:");
			File root = LittleFS.open("/");
			File file = root.openNextFile();

			while(file){
				Serial.print(" - ");
				Serial.println(file.name());
				file = root.openNextFile();
			}
		#endif
	}		



inline void notifyClients(String MESSAGE){
	ws.textAll(MESSAGE);
}


inline void initWiFi(){
    WiFi.mode(WIFI_STA);   // 🔥 Station mode

    WiFi.begin(AP_SSID, AP_PASS);

    Serial.print("Connecting to WiFi");

    while (WiFi.status() != WL_CONNECTED){
        delay(500);
        Serial.print(".");
    }

    Serial.println("\n✅ Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

inline void handleWebSocketMessage(void *arg, uint8_t *data, size_t len){
	AwsFrameInfo *info =(AwsFrameInfo*)arg;
	if (info -> final && info->index == 0 && info->len == len && info->opcode == WS_TEXT){
		data[len] = 0;
		Serial.println(((char*)data));
		String msg = String((char*)data);
	}
}

inline void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len){
	switch(type){
		case WS_EVT_CONNECT:
			Serial.printf("WebSocket client #%lu connected from %s \n ", (unsigned long)client->id(), client->remoteIP().toString().c_str() );
			break;
		case WS_EVT_DISCONNECT:
			Serial.printf("WebSocket client #%lu disconnected\n", (unsigned long)client->id());
			break;
		case WS_EVT_DATA:
			handleWebSocketMessage(arg, data, len);
			break;
		case WS_EVT_PONG:
		case WS_EVT_ERROR:
		case WS_EVT_PING:
		break;
	}
}

inline void initWebSocket(){
	ws.onEvent(onEvent);
	server.addHandler(&ws);
}

inline int Read_Distence(){
	return 0;
}
inline void initServer(){

    // Main page : Serve the main page on HTTP GET requests to "/"
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
			Serial.println("🔥 Client requested /");
      request->send(LittleFS, "/index.html", "text/html");
    });

    // Static files (CSS, JS, images)  from LittleFS
    server.serveStatic("/", LittleFS, "/");

    // 404 handler (🔥 pro touch)
    server.onNotFound([](AsyncWebServerRequest *request){
        request->send(404, "text/plain", "Not found");
    });

    server.begin();
}


#endif