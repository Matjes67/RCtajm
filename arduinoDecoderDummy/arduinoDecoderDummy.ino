int counter = 0;
void setup() {
  Serial.begin(9600);
}

void loop() {
  counter++;
  
  int car = analogRead(A0);
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
