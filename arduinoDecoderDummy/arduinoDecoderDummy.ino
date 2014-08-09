
boolean started = false;
char inByte;
int led = 13;
int counter = 200;


void setup() {
  Serial.begin(9600);
  pinMode(led, OUTPUT); 
}

void loop() {
  
  if (started) {
    digitalWrite(led, HIGH);
  counter++;
  if (counter >=210) {
    counter = 200;
    
  }
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
  delay(2000);        // delay in between reads for stability

  }
  else {
    digitalWrite(led, LOW);
  }
    if (Serial.available() > 0) {
    // get incoming byte:
    inByte = Serial.read();
    if (inByte == 'S') {
      started = true;
    }
    if (inByte == 'Q') {
      started = false;
    }
    }
}
