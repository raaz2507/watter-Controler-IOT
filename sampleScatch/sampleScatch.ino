#include "main.h"
#include "WebServer.h"
#include "UltrasonicSensor.h"


enum { trigPin = 18, echoPin = 19, relayPin = 5};
UltrasonicSensor sensor(trigPin, echoPin);

void setup(){
	Serial.begin(115200);

	pinMode(trigPin, OUTPUT);
	pinMode(echoPin, INPUT);
	pinMode(relayPin, OUTPUT);

	registerRoutes();
	
	
}

unsigned long previousMillis = 0;
const long interval = 1000;  // 1 second
void loop(){
	unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    notifyClients(String(Read_Distence()));
		Serial.println(sensor.getValue_JSN_SR04T());
  }

  ws.cleanupClients();
	yield();	 // 🔥 stability booster
}