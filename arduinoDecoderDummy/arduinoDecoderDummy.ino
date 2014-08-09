
boolean started = false;
char inByte;
int led = 13;
int counter = 200;
int burst = 2000;

void setup() {
  Serial.begin(9600);
  pinMode(led, OUTPUT); 
  pinMode(7, OUTPUT);   
  digitalWrite(7, LOW);
    pinMode(5, INPUT);   
  digitalWrite(5, HIGH);
}

void loop() {
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
 int car = counter;//analogRead(A0);
  int hit = analogRead(A1);
  int str = analogRead(A3);
  
  Serial.print("C:");
  Serial.print(car);
  
  Serial.print(":");
  Serial.print(millis());
  
  Serial.print(":");
  Serial.print(hit);
  
  Serial.print(":");
  Serial.print(str);
  
  Serial.println(":E"); 
}
