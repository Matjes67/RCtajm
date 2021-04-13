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



class AddTransponder(QDialog):

    def __init__(self, parent, root, name):
        super(AddTransponder, self).__init__(parent)
        self.root = root
        self.parent = parent
        self.name = name
        self.newTransponder = ""
        self.initUI()
        
    def initUI(self):

        self.ui = uic.loadUi(SRC_PATH+os.sep+'addtransponder.ui', self)
        self.setWindowTitle("AddTransponder")
        
        self.ui.comboBox.addItems(self.root.drivers.unknownTransponders)
        
        self.ui.buttonAdd.clicked.connect(self.onButtonAdd)
        self.ui.buttonCancel.clicked.connect(self.onButtonCancel)
        
    def onButtonCancel(self):
        self.accept()
        
    def onButtonAdd(self):
        self.newTransponder = self.ui.comboBox.currentText()
        
        if (self.newTransponder in self.root.drivers.unknownTransponders):
            self.root.drivers.unknownTransponders.remove(nr)
        
        print("close dialog")
        self.accept()