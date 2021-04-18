import time
from PyQt5.QtCore import *

class Race():
    
    
    def __init__(self, parent):
        self.parent = parent
        self.raceTime = 5*60
        self.countDown = 10
        
        self.startTime = 0
        self.raceTime = QElapsedTimer()
        
    def setRaceTime(self, input):
        # set race time in seconds
        self.raceTime = input
        
    def setCountDown(self, input):
        self.countDown = input
        
        
    def startRace(self):
        self.raceTime.start()
        return
        
    def getRaceTime(self):
        
        return self.raceTime.elapsed()/1000