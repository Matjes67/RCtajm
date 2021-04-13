import sys
import os
SRC_PATH = os.path.dirname(os.path.abspath(__file__))
sys.path.append(SRC_PATH+os.sep+'../common')

import netLog
from PyQt5 import QtWidgets, uic

from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import  *

import socket
from pathlib import Path
import traceback
import json

#Egna saker
import drivers
import addtransponder


class EditDriver(QDialog):

    def __init__(self, parent, root, name):
        super(EditDriver, self).__init__(parent)
        self.parent  = parent
        self.name = name
        self.root = root
        self.transponders = []
        self.initUI()
        
    def initUI(self):

        self.ui = uic.loadUi(SRC_PATH+os.sep+'editdriver.ui', self)
        self.setWindowTitle("Edit Driver")
        
        self.ui.buttonAdd.clicked.connect(self.onButtonAdd)
        self.ui.buttonSave.clicked.connect(self.onButtonSave)
        
        self.ui.lineEdit.setText(self.name)
        
        print(self.root.drivers.settings["drivers"])
        for driver in self.root.drivers.settings["drivers"]:
            if (driver["name"] == self.name):
                self.ui.listTransponders.addItems(driver["transponders"])
                self.transponders = driver["transponders"]
        
        if (self.ui.lineEdit.text() != self.name):
            print("rename driver")
            
    def onButtonAdd(self):
        dialog = addtransponder.AddTransponder(self, self.root, self.name)
        dialog.exec_()
        print("returned dialog", dialog.newTransponder)
        self.ui.listTransponders.addItem(dialog.newTransponder)
        for driver in self.root.drivers.settings["drivers"]:
            if (driver["name"] == self.name):
                self.transponders.append(dialog.newTransponder)
        
    def onButtonSave(self):
        newname = ""
        if (self.ui.lineEdit.text() != self.name):
            print("rename driver")
            newname = self.ui.lineEdit.text()
        self.root.drivers.updateDriver(self.name,self.transponders, newname )
        self.root.drivers.saveSettings()
        self.close()