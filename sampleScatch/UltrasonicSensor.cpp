#include "UltrasonicSensor.h"

// enum pinsetup{ trigerPin = 5, echoPin = 18 };

UltrasonicSensor::UltrasonicSensor(short trigerPin, short echoPin){
  init(trigerPin, echoPin);
}
void UltrasonicSensor::init(short trigerPin, short echoPin){
    this->trigerPin = trigerPin;
    this->echoPin = echoPin;

    pinMode(trigerPin, OUTPUT);
    pinMode(echoPin, INPUT);
}
// private
float UltrasonicSensor::applyKalman(float measurement, float measurementError, float processNoise) {
  // Gain calculate
  kalmanGain = kalmanError / (kalmanError + measurementError);

  // Update estimate
  kalmanEstimate = kalmanEstimate + kalmanGain * (measurement - kalmanEstimate);

  // Update error
  kalmanError = (1 - kalmanGain) * kalmanError + abs(kalmanEstimate - measurement) * processNoise;

  return kalmanEstimate;
}

float UltrasonicSensor::movingAverage(float newValue) {
  readings[index] = newValue;
  index = (index + 1) % N;

  float sum = 0;
  for(int i = 0; i < N; i++) {
    sum += readings[i];
  }

  return sum / N;
}

float UltrasonicSensor::medianFilter(float a, float b, float c) {
  if ((a > b && a < c) || (a < b && a > c)) return a;
  if ((b > a && b < c) || (b < a && b > c)) return b;
  return c;
}

float UltrasonicSensor::getValue_HC_SR04(){

  //trigger Signal
  digitalWrite(trigerPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigerPin, LOW);
  
  //Read Echo
  duration = pulseIn(echoPin, HIGH);
  
  //calculate Distance 
  distance =  duration * 0.034 / 2 ;
  
  // Apply Kalman Filter
  d1 = d2;
  d2 = d3;
  d3 = distance;   // new Reading
  
  float medianValue = medianFilter(d1, d2, d3);
  float kalmanValue = applyKalman(medianValue, SR04_measurementError, SR04_processNoise);
  float movingAverageValue = movingAverage(kalmanValue);
  
  // Serial.println("Distance "+ String(distance)+ " cm");
  // Serial.println("medianValue "+ String(medianValue)+ " cm");
  // Serial.println("kalmanValue "+ String(kalmanValue)+ " cm");
  // Serial.println("movingAverageValue "+ String(movingAverageValue)+ " cm");
  
  return movingAverageValue;
};

float UltrasonicSensor::getValue_JSN_SR04T(){
  digitalWrite(trigerPin, LOW);
  delayMicroseconds(5);

  digitalWrite(trigerPin, HIGH);
  delayMicroseconds(20);
  digitalWrite(trigerPin, LOW);

  duration = pulseIn(echoPin, HIGH, 30000);

  distance = duration * 0.034 / 2;
  //distance = round(distance * 10) / 10.0;  // stable, smooth output
  
  if(distance < 20){
      return -1;
  }

  d1 = d2;
  d2 = d3;
  d3 = distance;

  float medianValue = medianFilter(d1, d2, d3);
  float kalmanValue = applyKalman(medianValue, SR04T_measurementError, SR04T_processNoise);
  float movingAverageValue = movingAverage(kalmanValue);

  // Serial.println("Final Distance: " + String(movingAverageValue));

  return movingAverageValue;
}


// HC-SR04 genral
//JSN-SR04T-V3.0 i have 



/* About Sensors */
/*

Common Types and Models:

    HC-SR04 (Standard): The most common, cost-effective 4-pin module (VCC, Trig, Echo, GND) for Arduino, providing 2-400cm range.
    JSN-SR04T (Waterproof): Consists of a separate waterproof probe and control board, ideal for industrial or outdoor, wet environments.
    US-100 (High Precision/Temperature Compensation): Offers higher accuracy with integrated temperature compensation and supports UART or GPIO modes.
    HY-SRF05: Similar to HC-SR04 but updated for better reliability, often offering a 3-pin operating mode.
    Grove Ultrasonic Ranger: A modular version designed for easy connection with Grove shields [Image]. 

Key Features of Modules:

    Working Principle: Transmits a 40kHz sonic burst, receives the echo, and calculates distance based on time, using Formula:
    .
    Output: Typically provides a TTL digital signal (high-level pulse) corresponding to the echo time.
    Applications: Distance measurement, robotic navigation, obstacle detection, and proximity sensing.
    Operating Voltage: Usually
    DC, with some types supporting
    .
    Environmental Durability: Some units, like TDK’s, are rated up to IP65/67 for dust and water protection


note :
👉 JSN-SR04T sensitive है:

5V stable चाहिए
ESP32 से direct power कभी-कभी issue देता है

👉 better:

external 5V supply use करो

*/







