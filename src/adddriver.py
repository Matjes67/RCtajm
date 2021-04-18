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



class AddDriver(QDialog):

    def __init__(self, parent=None):
        super(AddDriver, self).__init__(parent)
        self.parent = parent
        self.initUI()
        
    def initUI(self):

        self.ui = uic.loadUi(SRC_PATH+os.sep+'adddriver.ui', self)
        self.setWindowTitle("Add Driver")
        
        self.ui.comboBox.addItems(self.parent.parent.drivers.unknownTransponders)
        
        self.ui.buttonAdd.clicked.connect(self.onButtonAdd)
        self.ui.buttonCancel.clicked.connect(self.onButtonCancel)
        
    def onButtonCancel(self):
        self.close()
        
    def onButtonAdd(self):
        nr = self.ui.comboBox.currentText()
        name = self.ui.lineEdit.text()
        if (nr in self.parent.parent.drivers.unknownTransponders):
            self.parent.parent.drivers.unknownTransponders.remove(nr)
        if (self.parent.parent.drivers.nameExists(name)):
            print("error")
        else:
            tr = []
            tr.append(nr)
            self.parent.parent.drivers.addDriver(name,tr )
            self.parent.parent.drivers.saveSettings()
            self.parent.createModel()
        print("close dialog")
        self.close()