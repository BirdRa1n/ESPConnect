
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>

int statusCode;
const char* ssid = "text";
const char* passphrase = "text";
const String host = "https://api.github.com";
String localIP;
String connectedNetwork;
String st;
String content;

//Function Decalration
bool testWifi(void);
void launchWeb(void);
void setupAP(void);

//Establishing Local server at port 80 whenever required
ESP8266WebServer server(80);
const int btnReset = D3;

void setup() {
  Serial.begin(9600);  //Initialising if(DEBUG)Serial Monitor
  Serial.println();
  Serial.println("Disconnecting previously connected WiFi");
  WiFi.disconnect();
  EEPROM.begin(512);  //Initialasing EEPROM
  delay(2000);

  pinMode(btnReset, INPUT_PULLUP);

  Serial.println();
  Serial.println();
  Serial.println("Startup");
  Serial.println("Reading EEPROM ssid");

  String esid;
  for (int i = 0; i < 32; ++i) {
    esid += char(EEPROM.read(i));
  }
  Serial.println();
  Serial.print("SSID: ");
  Serial.println(esid);
  Serial.println("Reading EEPROM pass");

  String epass = "";
  for (int i = 32; i < 96; ++i) {
    epass += char(EEPROM.read(i));
  }
  Serial.print("PASS: ");
  Serial.println(epass);

  if (digitalRead(btnReset) == LOW) {
    launchWeb();
    setupAP();
  } else {

    WiFi.begin(esid.c_str(), epass.c_str());
    if (testWifi()) {
      delay(200);
      Serial.println("Succesfully Connected!!!");
      launchWeb();
      return;
    } else {
      Serial.println("Turning the HotSpot On");
    }
  }

  Serial.println();
  Serial.println("Waiting.");

  while ((WiFi.status() != WL_CONNECTED)) {
    Serial.print(".");
    delay(100);
    server.handleClient();
  }
}
void loop() {
  server.handleClient();
  String esid;

  for (int i = 0; i < 32; ++i) {
    esid += char(EEPROM.read(i));
  }

  if (WiFi.isConnected()) {
    Serial.println("Connected! IP address: " + WiFi.localIP().toString());
    // a partir daqui você fará as requisições
  } else {
    ESP.restart();
  }
}
void createWebServerCO() {
  server.on("/networkinfo", []() {
    // Rota para retornar informações da rede Wi-Fi conectada
    String ssid = WiFi.SSID();
    int rssi = WiFi.RSSI();

    DynamicJsonDocument json(256);
    json["ssid"] = ssid;
    json["rssi"] = rssi;

    String content;
    serializeJson(json, content);

    server.send(200, "application/json", content);
  });
}
bool testWifi(void) {
  int c = 0;
  Serial.println("Waiting for Wifi to connect");
  while (c < 20) {
    if (WiFi.status() == WL_CONNECTED) {
      return true;
    }
    delay(500);
    Serial.print("*");
    c++;
  }
  Serial.println("");
  Serial.println("Connect timed out, opening AP");
  return false;
}
void launchWeb() {
  Serial.println("");
  if (WiFi.status() == WL_CONNECTED)
    Serial.println("WiFi connected");

  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("SoftAP IP: ");
  Serial.println(WiFi.softAPIP());
  createWebServer();
  // Start the server
  server.begin();
  Serial.println("Server started");
}
void setupAP(void) {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0)
    Serial.println("no networks found");
  else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*");
      delay(10);
    }
  }
  Serial.println("");
  st = "<ol>";
  for (int i = 0; i < n; ++i) {
    // Print SSID and RSSI for each network found
    st += "<li>";
    st += WiFi.SSID(i);
    st += " (";
    st += WiFi.RSSI(i);

    st += ")";
    st += (WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*";
    st += "</li>";
  }
  st += "</ol>";
  delay(100);
  WiFi.softAP("ESP82", "");
  Serial.println("softap");
  launchWeb();
  Serial.println("over");
}
void createWebServer() {
  {

    server.on("/networks", []() {
      // Obter a lista de redes Wi-Fi disponíveis
      int numNetworks = WiFi.scanNetworks();
      DynamicJsonDocument json(1024);
      JsonArray networks = json.createNestedArray("networks");

      for (int i = 0; i < numNetworks; i++) {
        JsonObject network = networks.createNestedObject();
        network["ssid"] = WiFi.SSID(i);
        network["rssi"] = WiFi.RSSI(i);
        network["encryption"] = WiFi.encryptionType(i);
      }

      String content;
      serializeJson(json, content);

      server.send(200, "application/json", content);
    });
    server.on("/setting", []() {
      String qsid = server.arg("ssid");
      String qpass = server.arg("pass");
      DynamicJsonDocument json(256);


      if (qsid.length() > 0 && qpass.length() > 0) {
        Serial.println("clearing eeprom");
        for (int i = 0; i < 96; ++i) {
          EEPROM.write(i, 0);
        }
        Serial.println(qsid);
        Serial.println("");
        Serial.println(qpass);
        Serial.println("");

        Serial.println("writing eeprom ssid:");
        for (int i = 0; i < qsid.length(); ++i) {
          EEPROM.write(i, qsid[i]);
          Serial.print("Wrote: ");
          Serial.println(qsid[i]);
        }
        Serial.println("writing eeprom pass:");
        for (int i = 0; i < qpass.length(); ++i) {
          EEPROM.write(32 + i, qpass[i]);
          Serial.print("Wrote: ");
          Serial.println(qpass[i]);
        }
        EEPROM.commit();

        // content = "{\"Success\":\"saved to eeprom... reset to boot into new wifi\"}";
        statusCode = 200;

        json["message"] = "defined wifi network";
        json["ssid"] = qsid;
        serializeJson(json, content);
        //delay(2000);
        //ESP.reset();
      } else {
        //  content = "{\"Error\":\"404 not found\"}";
        statusCode = 404;
        Serial.println("Sending 404");
        json["msg"] = "wifi network not defined";
        serializeJson(json, content);
      }
      server.sendHeader("Access-Control-Allow-Origin", "*");
      server.send(statusCode, "application/json", content);
      if (statusCode == 200) {
        delay(5000);
        ESP.reset();
      }
    });
    server.on("/", []() {
      DynamicJsonDocument json(256);
      json["msg"] = "ok";
      String content;
      serializeJson(json, content);
      server.send(200, "application/json", content);
    });
    server.on("/networkinfo", []() {
      // Rota para retornar informações da rede Wi-Fi conectada
      String ssid = WiFi.SSID();
      int rssi = WiFi.RSSI();

      DynamicJsonDocument json(256);
      json["ssid"] = ssid;
      json["rssi"] = rssi;

      String content;
      serializeJson(json, content);

      server.send(200, "application/json", content);
    });
    server.on("/deviceinfo", HTTP_GET, getDeviceInfo);
  }
}
void getDeviceInfo() {
  DynamicJsonDocument json(256);
  json["macAddress"] = WiFi.macAddress();
  json["localIP"] = WiFi.localIP().toString();
  json["chipID"] = ESP.getChipId();
  json["flashChipID"] = ESP.getFlashChipId();
  json["flashChipSize"] = ESP.getFlashChipRealSize();
  json["sdkVersion"] = ESP.getSdkVersion();
  json["firmwareVersion"] = ESP.getSketchMD5();
  json["voltage"] = ESP.getVcc();
  json["gatewayIP"] = WiFi.gatewayIP().toString();
  json["dnsIP"] = WiFi.dnsIP().toString();



  String content;
  serializeJson(json, content);

  server.send(200, "application/json", content);
}
