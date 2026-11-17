#F1 

Recently I found out that there is an open source API project on [Github]( https://openf1.org/?shell#introduction): and it instantly made me think of all the opportunities available to create F1 themed projects based on real F1 data. As part of the API it even allows reading this data in real time from the telemetry system, many people use this for analytics to see how cars and drivers compare but my mind instantly went elsewhere, what if I could mix my electronics, software and data analytics knowledge together to make physical hardware that reacts based on the race such as:
- A desk monitor to track your favourite car or team during the race
- An LED strip to show the car positions on track
- An LED strip to show your favourite driver segment times (Red, Yellow, Green, Purple)
- Among many other things

Or the one I started working on: An F1 Lamp that changes based on the race state (Flags)

To start testing if I could get this working without purchasing any hardware I found a very cool online tool [Wokwi](https://wokwi.com/projects/new/esp32) which allows you to 


Wonder if I could work with someone like: https://www.etsy.com/uk/shop/DimensionalDesignsUK and sell an integrated light?

```
#include <EEPROM.h>

#include <WiFi.h>

#include <HTTPClient.h>

#include <ArduinoJson.h>

  

//wifi details

#define WIFI_SSID "Wokwi-GUEST"
 
#define WIFI_PASSWORD ""

  

int a = 0;

int value;

int ledRState = false;

int ledGState = false;

int ledBState = false;

  
  
  

HTTPClient http;

const String flagUrl = "https://api.openf1.org/v1/race_control?session_key=latest";

  

int sectionsYellow[100] = {0};

int anyYellow = 0;

int anyRed = 0;

int chequeredBeen = 0;

  

void setup() {

  // put your setup code here, to run once:

  Serial.begin(115200);

  pinMode(33, OUTPUT);

  pinMode(25, OUTPUT);

  pinMode(32, OUTPUT);

  

  //Connect to WIFI

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to WiFi ");

  Serial.print(WIFI_SSID);

  // Wait for connection

  while (WiFi.status() != WL_CONNECTED) {

    delay(100);

    Serial.print(".");

  }

  Serial.println(" Connected!");

  Serial.print("IP address: ");

  Serial.println(WiFi.localIP());

  

}

  

void loop() {

  

  updateSectionsYellow();

  setRGBBasedOnFlag();

  

  delay(270);

}

  

void updateSectionsYellow(){

  http.begin(flagUrl);

    int httpCode = http.GET();

    if (httpCode > 0) {

      StaticJsonDocument<768> doc;

        DeserializationError error = deserializeJson(doc, http.getString());

  

        if (error) {

          Serial.print(F("deserializeJson failed: "));

          Serial.println(error.f_str());

          delay(2500);

          return;

        }

  
  

        JsonArray arr = doc.as<JsonArray>();

        for (JsonObject value : arr) {

          if(value["flag"].as<String>()=="YELLOW"||value["flag"].as<String>()=="DOUBLE YELLOW"){

            sectionsYellow[atoi(value["sector"])]=1;

          }

          else if(value["flag"].as<String>()=="RED"){

            sectionsYellow[atoi(value["sector"])]=2;

          }

          else if(value["flag"].as<String>()=="CLEAR"){

            sectionsYellow[atoi(value["sector"])]=0;

          }

          else if(value["flag"].as<String>()=="CHEQUERED"){

            chequeredBeen = 1;

          }

        }

  
  

        for(int i = 0; i < 100; i++){

          if(sectionsYellow[i]==1){

            anyYellow = 1;

          }

          else{

            anyYellow = 0;

          }

          if(sectionsYellow[i]==2){

            anyRed = 1;

          }

          else{

            anyRed = 0;

          }

        }

  

    }

}

  

void setRGBBasedOnFlag(){

  if (chequeredBeen = 1){

    if(ledRState == ledGState && ledRState == ledBState){

      ledRState = !ledRState;

      ledGState = !ledGState;

      ledBState = !ledBState;

    }

    else{

      ledRState = true;

      ledGState = true;

      ledBState = true;

    }

  }

  else if (anyYellow == 1){

      ledRState = true;

      ledGState = true;

      ledBState = false;}

  else if (anyRed ==  1){

      ledRState = true;

      ledGState = false;

      ledBState = false;}

  else {

      ledRState = false;

      ledGState = true;

      ledBState = false;}

  

    digitalWrite(33, ledRState);

    digitalWrite(25, ledGState);

    digitalWrite(32, ledBState);

  }
```