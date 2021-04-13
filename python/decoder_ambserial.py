import serial
import time
import netLog

class AmbSerial():

    def __init__(self,port, baud):
        self.port = port
        self.baud = baud
        self.connected = False
        self.databuffer = ""
        try:
            print("Connecting serial device: ", self.port, self.baud)
            self.dec = serial.Serial(self.port,self.baud,timeout=5)
            time.sleep(1)
            self.dec.write(b"AMBRC MODE\n")
            self.connected = True
        except:
            self.connected = False
            print("fail to create serial")
            
            
    def checkData(self):
        if self.connected:
            msg = self.dec.read(self.dec.inWaiting()) # read everything in the input buffer
            self.databuffer = self.databuffer + msg.decode()
            if ("\n" in self.databuffer):
                data = self.databuffer.split("\n", 1)
                self.databuffer = data[1]
                data = data[0]
                
                if "@" in data:
                    #print(data)
                    data = data.split("\t")
                    netLog.LOG_INFO(data)
                    out = {}
                    out["status"] = "time"
                    out["nr"] = data[3]
                    out["time"] = data[4]
                    out["strength"] = data[5]
                    out["hits"] = data[6]
                    netLog.LOG_INFO(out)
                    return out
                if "#" in data:
                    netLog.LOG_INFO(data)
                    out = {}
                    out["status"] = "ping"
                    return out
            else:
                out = {}
                out["status"] = "idle"
                return out
            
        else:
            out = {}
            out["status"] = "error"
            return out

    def checkStatus(self):
        return self.connected
