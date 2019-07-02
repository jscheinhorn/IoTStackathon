// "Distributed with a free-will license.
// Use it any way you want, profit or free, provided it fits in the licenses of its associated works."
// ADXL345 Accelerometer and ESP8266 WiFi Module
// This code sends the WiFi module's IP Address and the X, Y, and Z Accelerometer Data to http://8266.local/
// You may want to calibrate your accelerometer data for best results.
// Updated July 2, 2019 by Jennifer Scheinhorn

#include <ESP8266WiFi.h>      // Enables ESP8266 to hook up to Local Area Network
#include <WiFiClient.h>       // Makes the ESP8266 a wifi client (aka station vs. AP)
#include <ESP8266WiFiMulti.h> // Allows the wifi client to search for the strongest network
#include <ESP8266WebServer.h> // Lets ESP8266 act as a server
#include <ESP8266mDNS.h>      // Provides a constant name for the server host IP address
#include <Wire.h>             // Allows for I2C communication
                              // There is an ADXL library <SparkFun_ADXL345.h> that abstracts away some of the things like using the hex register addresses for the X,Y,Z data

// ADXL345 I2C address is 0x53(83)
#define Addr 0x53

ESP8266WiFiMulti wifiMulti;  // Create an instance of the ESP8266WiFiMulti class, called 'wifiMulti'
ESP8266WebServer server(80); // Create a webserver object that listens for HTTP request on port 80

// ESP8266 SDA & SCL PINS
const uint8_t scl = 14; //D5
const uint8_t sda = 2;  //D6

// RAW DATA VARIABLES
float xAccl, yAccl, zAccl;

// CALIBRATED DATA VARIABLES
float accX = 0;
float accY = 0;
float accZ = 0;

// CALIBRATION VALUES
#define offsetX -6.2500 // OFFSET values
#define offsetY -1.2500
#define offsetZ -9.5000

#define gainX 259.5000 // GAIN factors
#define gainY 263.5000
#define gainZ 253.0000

// Handleroot is the function that executes when the root route is hit
// It initiates conversation with the ADXL, gathers the data, and defines its output to the log and the web server.
void handleroot()
{
  unsigned int data[6];

  // For I2C transmission: begin trasmission goes to the I2C address to alert incoming I2C information
  // The first write is to specify a particular option
  // The second write is to adjust that option

  // Start I2C Transmission to ADXL I2C Addr - Data Rate and Power Mode Control.
  Wire.beginTransmission(Addr);
  // Select bandwidth rate register
  Wire.write(0x2C);
  // Normal mode, Output data rate = 100 Hz
  Wire.write(0x0A);
  // Stop I2C transmission
  Wire.endTransmission();

  // Start I2C Transmission - Power-saving Features Control (Here: Disable Auto-sleep)
  Wire.beginTransmission(Addr);
  // Select power control register
  Wire.write(0x2D);
  // Auto-sleep disable
  Wire.write(0x08);
  // Stop I2C transmission
  Wire.endTransmission();

  // Start I2C Transmission - Data Format Control
  Wire.beginTransmission(Addr);
  Wire.write(0x31);
  // Self test disabled, 4-wire interface, Full resolution 16g, Range = +/-2g
  Wire.write(0x08);
  // Stop I2C transmission
  Wire.endTransmission();
  delay(300);

  // Loop to retrieve all 6 locations' worth of accelerometer data
  for (int i = 0; i < 6; i++)
  {
    // Start I2C Transmission
    Wire.beginTransmission(Addr);
    // Select data register (loops one by one through registers 50-56 [decimal address], 0x32-0x38 [hex address], it appears write understands both)
    Wire.write((50 + i));
    // Stop I2C transmission
    Wire.endTransmission();

    // Request a quantity of 1 byte of data from ADXL's I2C Addr
    Wire.requestFrom(Addr, 1);

    // Read and store 6 bytes of data
    // xAccl lsb, xAccl msb, yAccl lsb, yAccl msb, zAccl lsb, zAccl msb
    if (Wire.available() == 1)
    {
      data[i] = Wire.read();
    }
  }

  // Convert the data to 10-bits (This process uses bitwise & operator: if 0x03 = 0 it will be 0, if 0x03 = 1 the value will be the byte value.)
  // Explain why to 10-bit:
  int xAccl = (((data[1] & 0x03) * 256) + data[0]);
  if (xAccl > 511)
  {
    xAccl -= 1024; // If  negative g, subtract 1024
  }
  int yAccl = (((data[3] & 0x03) * 256) + data[2]);
  if (yAccl > 511)
  {
    yAccl -= 1024;
  }
  int zAccl = (((data[5] & 0x03) * 256) + data[4]);
  if (zAccl > 511)
  {
    zAccl -= 1024;
  }

  // Converting the data to represent values in terms of gravity (where 1 is equal to 1g)
  accX = (xAccl - offsetX) / gainX; // Calculating New Values for X, Y and Z
  accY = (yAccl - offsetY) / gainY;
  accZ = (zAccl - offsetZ) / gainZ;

  // Converting the converted data to string to include desired decimal places
  char x_buffer[10];
  String X = dtostrf(accX, 7, 4, x_buffer);
  char y_buffer[10];
  String Y = dtostrf(accY, 7, 4, y_buffer);
  char z_buffer[10];
  String Z = dtostrf(accZ, 7, 4, z_buffer);

  // Output data to serial monitor
  Serial.print("Acceleration in X-Axis : ");
  Serial.println(xAccl);
  Serial.println(X);
  Serial.print("Acceleration in Y-Axis : ");
  Serial.println(yAccl);
  Serial.println(accY);
  Serial.print("Acceleration in Z-Axis : ");
  Serial.println(zAccl);
  Serial.println(accZ);
  delay(300);

  // Make IP Address a String
  IPAddress myIP = WiFi.localIP();
  String ip = String(String(myIP[0]) + "." +
                     String(myIP[1]) + "." +
                     String(myIP[2]) + "." +
                     String(myIP[3]));

  // JSON Post Data to web server
  String PostData = String("{\"x\":" + String(X) + ", \"y\":" + String(Y) + ", \"z\":" + String(Z) + ", \"ip0\":" + String(myIP[0]) + ", \"ip1\":" + String(myIP[1]) + ", \"ip2\":" + String(myIP[2]) + ", \"ip3\":" + String(myIP[3]) + "}"); // your JSON payload
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
  server.send(200, "application/json", PostData);
}

void setup()
{
  // Initialise I2C communication as MASTER
  Wire.begin(sda, scl);
  // Initialise serial communication, set baud rate = 115200
  Serial.begin(115200);

  // Start the mDNS responder for esp8266.local
  if (MDNS.begin("esp8266"))
  {
    Serial.println("mDNS responder started");
  }
  else
  {
    Serial.println("Error setting up MDNS responder!");
  }

  // Connect to WiFi network & Wait for connection
  wifiMulti.addAP("YOUR_WIFI_NETWORK_NAME_1", "NETWORK_PASSWORD_1");
  wifiMulti.addAP("YOUR_WIFI_NETWORK_NAME_2", "NETWORK_PASSWORD_2");
  wifiMulti.addAP("YOUR_WIFI_NETWORK_NAME_3", "NETWORK_PASSWORD_3");

  while (wifiMulti.run() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());

  // Get the IP address of ESP8266
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  //TEST
  IPAddress myIP = WiFi.localIP();
  String ip = String(String(myIP[0]) + "." +
                     String(myIP[1]) + "." +
                     String(myIP[2]) + "." +
                     String(myIP[3]));
  Serial.println(ip);

  // Start the server
  server.on("/", handleroot);
  server.begin();
  Serial.println("HTTP server started");
}

void loop()
{
  server.handleClient();
}
