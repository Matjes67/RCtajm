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
        self.loadSettings()

    def loadSettings(self):
        self.settingsfilename = "drivers.json"
        self.settings = {}

        my_file = Path(self.settingsfilename)
        if my_file.is_file():
            with open(self.settingsfilename) as settings_file:
                self.settings = json.load(settings_file)
        else:
            self.settings["port"] = "/dev/ttyACM0"
            self.settings["decoder"] = "ambserial"

    def saveSettings(self):
        with open(self.settingsfilename, 'w') as outfile:
            json.dump(self.settings, outfile, indent=3, sort_keys=True)

    def addDriver(self, name, transponders):
        return

    def getDriver(self, nr):

        return str(nr)
