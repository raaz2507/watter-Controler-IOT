#include "main.h"

// 🔥 Debug: list all files
#define DEBUG_FS 1


// Configure SoftAP settings and network parameters:



// - Static IP, gateway, and subnet mask for hosting the web server
IPAddress local_IP (192,168,4,18);
IPAddress gateway (192, 168,4, 9);
IPAddress subnet (255, 255, 255 , 0);

// Create AsyncWebServer object on port 80
//AsyncWebServer server(80);

// Create a WebSocket object
AsyncWebSocket ws("/ws");



// Initialize LittleFS
void initLittleFS(){
	if (!LittleFS.begin(true)){  // 🔥 auto format if fail
		Serial.println("❌ LittleFS Mount Failed");
		return;
	}
	Serial.println("✅ LittleFS Mounted");

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

// Send WebSocket
void notifyClients(String MESSAGE){
	ws.textAll(MESSAGE);
}


#define WIFI_SSID "P4"
#define WIFI_PASS "12344321"

void initWiFi(){
    WiFi.mode(WIFI_STA);   // 🔥 Station mode

    WiFi.begin(WIFI_SSID, WIFI_PASS);

    Serial.print("Connecting to WiFi");

    while (WiFi.status() != WL_CONNECTED){
        delay(500);
        Serial.print(".");
    }

    Serial.println("\n✅ Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}



// Process incoming WebSocket text messages
// Parse "RGB:" commands, and update the RGB LED color accordingly

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len){
	AwsFrameInfo *info =(AwsFrameInfo*)arg;
	if (info -> final && info->index == 0 && info->len == len && info->opcode == WS_TEXT){
		data[len] = 0;
		Serial.println(((char*)data));
		String msg = String((char*)data);
	}
}

// Cases to happen on certain Wi-Fi Events
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len){
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

// Initialize the WebSocket endpoint used by the website’s JavaScript:
// This registers the “/ws” path so that client-side code can open a WebSocket
// connection to receive and send messages in real time via the onEvent handler.
void initWebSocket(){
	ws.onEvent(onEvent);
	server.addHandler(&ws);
}


// Sends a trigger pulse to the ultrasonic sensor, measures the echo return time,
// calculates the distance in centimeters based on the speed of sound,
// prints the measured distance, and returns it.
int Read_Distence(){
	return 0;
}

void initServer(){

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


void sayHello(){
	Serial.println("Hello neha");
}