
boolean started = false;
char inByte;
int led = 13;
int counter = 200;
int burst = 2000;

int packet = 0;

#define PING 5000;
long pingtime = 0;
long cartime = 0;

long cars[] = {2000000,3000000,4000000,5000000,6000000,7000000,8000000 };

void setup() {
  Serial.begin(115200);
  pinMode(led, OUTPUT); 
  pinMode(7, OUTPUT);   
  digitalWrite(7, LOW);
    pinMode(5, INPUT);   
  digitalWrite(5, HIGH);
}

void loop() {

  if (pingtime < millis()) {
    sendPing();
    pingtime = millis() + PING;
  }
  if (cartime < millis()) {
    sendCar();
    cartime = millis() + 1000 + random(1000);
  }
  if(digitalRead(5)) {
    burst = 2000;
    //Serial.println("knapp");
  }
  else {
    burst = 0;
  }
  
  if (started) {
    digitalWrite(led, HIGH);
    counter++;
    if (counter >=210) {
      counter = 200;
    }
    sendCar();
    delay(burst);        // delay in between reads for stability
  }
  else {
    digitalWrite(led, LOW);
  }
  
  if (Serial.available() > 0) {
    // get incoming byte:
    inByte = Serial.read();
    if (inByte == 'S') {
      started = true;
      delay(2000);
      
      for (int i=0;i<10;i++) {
        counter++;
        if (counter >=210) {
          counter = 200;
        }
        sendCar();
        delay(20);
      }
      delay(2000);
    }
    if (inByte == 'Q') {
      started = false;
    }
    }
}
void sendCar() {
  packet +=1;
  int car = counter;//analogRead(A0);
  long transponder = cars[random(7)];
  float time1 = float(millis())/1000.0;
  int hit = random(200);
  int str = random(200);
  
  Serial.print("@");
  Serial.print("\t");
  
  Serial.print("1");
  Serial.print("\t");
  
  Serial.print(packet);
  Serial.print("\t");

  Serial.print(transponder);
  Serial.print("\t");

  Serial.print(time1);
  Serial.print("\t");
    
  Serial.print(str);
  Serial.print("\t");
  
   Serial.print(hit);
  Serial.print("\t"); 
  
  Serial.print("1");
  Serial.print("\t");
  
  Serial.println("x1234");  // TODO Checksum; 
}

void sendPing() {
  packet +=1;
    Serial.print("#");
  Serial.print("\t");
  
  Serial.print("1");
  Serial.print("\t");
  
  Serial.print(packet);
  Serial.print("\t");
  
  Serial.print("1");
  Serial.print("\t");
  
  Serial.println("x1234");  // TODO Checksum

}
