#ifndef ULTRASONICSENSOR_H
#define ULTRASONICSENSOR_H

// #include <Arduino.h>

class UltrasonicSensor{
  private:
    //pinSetup
    short trigerPin;
    short echoPin;


    long distance;
    float duration;
    float d1=0, d2=0, d3=0;

    //kalman Algo related Variabls
    float kalmanEstimate = 0;
    float kalmanError = 1;

    //for // HC-SR04
    float SR04_measurementError = 2;
    float SR04_processNoise = 0.01;

    //for //JSN-SR04T-V3.0
    float SR04T_measurementError = 5;
    float SR04T_processNoise = 0.05;
    float kalmanGain;

    float applyKalman(float measurement, float measurementError, float processNoise);

    // movingAverage related veriables
    static const short N =5; //prisionLavel
    float readings[N];
    int index = 0;
    float movingAverage(float newValue);

    //medianFilter
    float medianFilter(float a, float b, float c);
  public:
    UltrasonicSensor(short trigerPin, short echoPin);

    void init(short trigerPin, short echoPin);
    float getValue_HC_SR04();
    float getValue_JSN_SR04T();
};

#endif