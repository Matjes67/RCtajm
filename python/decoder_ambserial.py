import serial
import time

class AmbSerial():

    def __init__(self,port):
        self.port = port
        self.connected = False
        try:
            self.dec = serial.Serial(self.port,115200,timeout=5)
            time.sleep(1)
            self.dec.write(b"AMBRC MODE\n")
            self.connected = True
        except:
            self.connected = False
            print("fail to create serial")
    def checkData(self):
        if self.connected:
            msg = self.dec.read(self.dec.inWaiting()) # read everything in the input buffer
            data = msg.decode()
            if len(data) <5:
                out = {}
                out["status"] = "idle"
                return out
            print(data)
            if "@" in data:
                #print(data)
                data = data.split("\t")
                print(data)
                out = {}
                out["status"] = "time"
                out["nr"] = data[3]
                out["time"] = data[4]
                out["strength"] = data[5]
                out["hits"] = data[6]
                print(out)
                return out
            if "#" in data:
                out = {}
                out["status"] = "ping"
                return out
            out = {}
            out["status"] = "idle"
            return out
        else:
            out = {}
            out["status"] = "error"
            return out

    def checkStatus(self):
        return self.connected
