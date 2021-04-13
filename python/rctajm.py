#!/usr/bin/python3
import sys
import os
SRC_PATH = os.path.dirname(os.path.abspath(__file__))
sys.path.append(SRC_PATH+os.sep+'../common')

import netLog
from PyQt5 import QtWidgets, uic

from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import  *
netLog.speedLog("import klart qt")

import socket
from pathlib import Path
import traceback
import json
#from pathlib import Path
#from functools import partial
netLog.speedLog("import klart sys")
#Egna saker
import drivers

netLog.speedLog("import klart eget")
#netLog.speedLog("started")

SRC_PATH = os.path.dirname(os.path.abspath(__file__))

NR_OUTPUTS = 8

import time

def current_milli_time():
    return round(time.time() * 1000)

class RcTajm(QMainWindow):
    def __init__(self):
        super(RcTajm,self).__init__()
        self.settings = {}
        self.loadSettings()
        self.checkboxList = []
        self.ipList = []
        self.portList = []
        self.packets = 0
        self.initUI()


        self.decThread = DecThread(self)
        self.drivers = drivers.Drivers()

        self.timeList = []



        redrawMs = 500
        self.timer1 = QTimer()
        self.timer1.timeout.connect(self.redraw)
        self.timer1.start(redrawMs)
        self.onUpdateButton()
        self.decThread.start()
        self.createModel()

    def initUI(self):

        self.ui = uic.loadUi(SRC_PATH+os.sep+'maingui.ui', self)
        try:
            f = open(SRC_PATH + os.sep + ".." + os.sep + "VERSION", "r")
            ver = f.read()
            print(ver)
            versionstring = ver.replace("\n", "")
        except Exception as err:
            print(err)
            versionstring = os.environ.get("GIT_VERSION", ".v")

        #versionstring = os.environ.get("GIT_VERSION", "v0.0.0")
        self.setWindowTitle("rcTajm "+versionstring)
        self.ui.statusbar.setStyleSheet("QStatusBar{padding-left:8px;background:rgba(102,204,255,255);color:black;font-weight:bold;}");
        self.ui.statusbar.hide()


        #self.ui.pushButton.clicked.connect(self.onUpdateButton)

        #self.ui.portIn.setText(str(self.settings["portIn"]) )

    def createModel(self):
        #tagFilter = self.ui.tagSearch.text()
        #descFilter = self.ui.descSearch.text()
        #systemFilter = self.ui.comboBoxSystem.currentText()
        #categoryFilter = str(self.ui.comboBoxCategory.currentText())
        self.model = QStandardItemModel()

        counter = 0
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "Driver" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "transponder" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "Time" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "Laps" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "Hits" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "Strength" ) )


        for ff in self.timeList:
            #tag, desc = ff
            #if (tagFilter.lower() in ff["Identity"].lower() and descFilter.lower() in ff["Description"].lower()):
                #if (systemFilter in ff["System"]):
                    #print(ff["Group"])

                    driver = ff["driver"]
                    coldriver = QStandardItem(driver)
                    coldriver.setData( driver,  Qt.UserRole + 1)
                    coldriver.setEditable(False)

                    coltran = QStandardItem( ff["transponder"] )
                    coltran.setData( ff["transponder"],  Qt.UserRole + 1)
                    coltran.setEditable(False)

                    coltime = QStandardItem( f"{ff['time']:.4}" )
                    coltime.setData( ff["time"],  Qt.UserRole + 1)
                    coltime.setEditable(False)

                    collaps = QStandardItem( str(ff["laps"]) )
                    collaps.setData( ff["laps"],  Qt.UserRole + 1)
                    collaps.setEditable(False)

                    colhits = QStandardItem( str(ff["hits"]) )
                    colhits.setData( ff["time"],  Qt.UserRole + 1)
                    colhits.setEditable(False)

                    colstre = QStandardItem( str(ff["strength"]) )
                    colstre.setData( ff["strength"],  Qt.UserRole + 1)
                    colstre.setEditable(False)

                    rowlist = [ coldriver, coltran, coltime, collaps, colhits, colstre ]

                    self.model.appendRow( rowlist )



        self.ui.tableView.setModel(self.model)
        #self.ui.tableViewAF.setModel(self.modelAF)
        #self.ui.listView.setModel(self.modelFF)
        #for i in range(self.modelFF.columnCount() ):
        #    self.ui.tableView.resizeColumnToContents(i)
        #self.ui.tableView.setColumnWidth(0, 300)
        #self.ui.tableView.resizeColumnToContents(0)
        #self.ui.tableView.resizeColumnToContents(1)
        #self.ui.tableView.setColumnWidth(1, 400)


    def loadSettings(self):
        self.settingsfilename = "settings.json"
        self.settings = {}

        my_file = Path(self.settingsfilename)
        if my_file.is_file():
            with open(self.settingsfilename) as settings_file:
                self.settings = json.load(settings_file)
        else:
            self.settings["port"] = "/dev/ttyACM0"
            self.settings["decoder"] = "ambserial"


    def closeEvent(self, event):
        self.decThread.running = False
        event.accept() # let the window close

    def redraw(self):
        if (self.packets != self.decThread.counter):
            self.ui.labelPackets.setStyleSheet("background-color: lightgreen")
        else:
            self.ui.labelPackets.setStyleSheet("background-color: red")
        rate = self.decThread.counter - self.packets
        rate = rate *2
        self.packets = self.decThread.counter
        self.ui.labelPackets.setText(""+str(self.packets))
        #self.ui.labelRate.setText(""+str(rate)+"/s")

        self.createModel()

    def saveSettings(self):
        with open(self.settingsfilename, 'w') as outfile:
            json.dump(self.settings, outfile, indent=3, sort_keys=True)

    def onUpdateButton(self):
        #portIn = int(self.ui.portIn.text())
        #self.settings["portIn"] = portIn
        #print("update ", portIn)

        #self.decThread.updateValues(portIn, ulist)
        self.saveSettings()

    def parseTimeData(self, indata):
        print("parsetimedata", indata)
        driver = self.drivers.getDriver(indata["nr"])
        for times in self.timeList:
            if times["driver"] == driver:
                times["transponder"] = indata["nr"]
                times["time"] = float(indata["time"]) - float(times["oldtime"])
                times["oldtime"] = float(indata["time"])
                times["strength"] = indata["strength"]
                times["hits"] = indata["hits"]
                times["laps"] += 1
                return
        out = {}
        out["driver"] = driver

        out["transponder"] = indata["nr"]
        out["time"] = float(indata["time"])
        out["oldtime"] = float(indata["time"])
        out["strength"] = indata["strength"]
        out["hits"] = indata["hits"]

        out["laps"] = 0
        self.timeList.append(out)

import threading
import time

exitFlag = 0

import decoder_ambserial
class DecThread(threading.Thread):

    def __init__(self, parent):
        threading.Thread.__init__(self)
        self.parent = parent
        self.counter = 0
        self.running = True
        self.update = True
        self.outputList = []
        self.decoder = 0
        if (self.parent.settings["decoder"] == "ambserial"):
            self.decoder = decoder_ambserial.AmbSerial(self.parent.settings["port"])
            print("decoder ambserial")

    def run(self):
        netLog.speedLog("started decThread")

        self.update = True
        self.counter = 110
        while self.running:
            if self.update:
                self.counter = 0
                self.update = False

            res = self.decoder.checkData()
            if ("status" in res):
                if (res["status"] == "ping" or res["status"] == "time"):
                    self.counter = self.counter+1
                if res["status"] == "time":
                    self.parent.parseTimeData(res)
            time.sleep(0.001)


    def updateValues(self, portIn, ulist):
        self.localPort = int(portIn)
        self.outputList = ulist
        self.update = True



if __name__ == "__main__":
    netLog.speedLog("started main")
    try:
        app = QApplication(sys.argv)

        win = RcTajm()
        win.show()
        sys.exit(app.exec_())
    except Exception as err:
        exception_type = type(err).__name__
        print(exception_type)
        #nl.netLog(f"exception {exception_type}")
        #nl.netLog(f"stacktrace {traceback.format_exc()}")
        print(traceback.format_exc())
        os._exit(1)
