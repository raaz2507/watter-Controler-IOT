#ifndef MAIN_H
#define MAIN_H

#include <Arduino.h>           // Core Arduino functionality (GPIO, timing, Serial, etc.)		
#include <ESPAsyncWebServer.h>    // Asynchronous HTTP and WebSocket server built on AsyncTCP
#include <AsyncTCP.h>							// Non-blocking TCP library for asynchronous networking

#include <WiFi.h>                 // ESP32 Wi-Fi management (AP and Station modes)

#include "LittleFS.h"							// Flash-based file system for serving website files

// - SSID, password, channel, visibility, and max clients
#define AP_SSID "P4"
#define AP_PASS "12344321"
#define AP_CHANNEL 1
#define AP_HIDDEN false
#define AP_MAX_CON 8

//Network Config
extern IPAddress local_IP;
extern IPAddress gateway;
extern IPAddress subnet;

// Server objects
extern AsyncWebServer server;
extern AsyncWebSocket ws;


void sayHello();    		//function declare
void initLittleFS();		//Initialize LittleFS
void notifyClients(String MESSAGE);
void initWiFi();
void handleWebSocketMessage(void *arg, uint8_t *data, size_t len);
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);
void initWebSocket();
int Read_Distence();
void initServer();


#endif