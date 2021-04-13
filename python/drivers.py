#!/usr/bin/python3
import sys
import os
SRC_PATH = os.path.dirname(os.path.abspath(__file__))
sys.path.append(SRC_PATH+os.sep+'../common')


from pathlib import Path
import traceback
import json
SRC_PATH = os.path.dirname(os.path.abspath(__file__))

import time

def current_milli_time():
    return round(time.time() * 1000)

class Drivers():
    def __init__(self):
        super(Drivers,self).__init__()
        self.settings = {}
        self.unknownTransponders = []
        self.loadSettings()

    def loadSettings(self):
        self.settingsfilename = "drivers.json"
        self.settings = {}

        my_file = Path(self.settingsfilename)
        if my_file.is_file():
            with open(self.settingsfilename) as settings_file:
                self.settings = json.load(settings_file)
        else:
            self.settings["test"] = "banan"
        if "drivers" not in self.settings:
            self.settings["drivers"] = []
            driver = {}
            driver["name"] = "BananOla"
            driver["transponders"] = []
            driver["transponders"].append(str(3000000))
            self.settings["drivers"].append(driver)
            

    def saveSettings(self):
        with open(self.settingsfilename, 'w') as outfile:
            json.dump(self.settings, outfile, indent=3, sort_keys=True)

    def addDriver(self, name, transponders):
        driver = {}
        driver["name"] = name
        driver["transponders"] = transponders
        self.settings["drivers"].append(driver)
        return
    def addTransponder(self, name, transponders):
        
        return

    def getDriver(self, nr):
        nr = str(nr)
        #print("getDriver", nr)
        for driver in self.settings["drivers"]:
            
            if ("transponders" in driver and "name" in driver):
                #print(driver)
                if (nr in driver["transponders"]):
                    #print("found driver",driver["name"], nr )
                    return driver["name"]
        self.unknownTransponders.append(nr)
        return "unknown driver "+str(nr)
        
    def nameExists(self, name):
        for driver in self.settings["drivers"]:
            
            if ("name" in driver):
                #print(driver)
                if (name in driver["name"]):
                    #print("found driver",driver["name"], nr )
                    return True
                    
        return False
