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
import adddriver


class EditDrivers(QDialog):

    def __init__(self, parent=None):
        super(EditDrivers, self).__init__(parent)
        self.parent = parent
        self.selectedName = ""
        self.initUI()
        
    def initUI(self):

        self.ui = uic.loadUi(SRC_PATH+os.sep+'editdrivers.ui', self)
        self.setWindowTitle("Drivers")
        
        self.ui.buttonEdit.clicked.connect(self.onButtonEditDriver)
        self.ui.buttonAddNew.clicked.connect(self.onButtonNewDriver)
        
        self.ui.tableView.clicked.connect(self.onSingleClick)

        self.createModel()

    def createModel(self):
        
        self.model = QStandardItemModel()

        counter = 0
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "Driver" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "transponder" ) )
        

        print("creating model", self.parent.drivers.settings["drivers"])
        for driver in self.parent.drivers.settings["drivers"]:
            
            name = driver["name"]
            coldriver = QStandardItem(driver["name"])
            coldriver.setData( name,  Qt.UserRole + 1)
            coldriver.setEditable(False)

            coltran = QStandardItem( str(driver["transponders"]) )
            coltran.setData( name,  Qt.UserRole + 1)
            coltran.setEditable(False)


            rowlist = [ coldriver, coltran]

            self.model.appendRow( rowlist )



        self.ui.tableView.setModel(self.model)    
        
        
    def onButtonEditDriver(self):
        if (self.selectedName != ""):
            dialog = editdriver.EditDriver(self, self.selectedName)
            dialog.show()
        return
        
    def onButtonNewDriver(self):
        dialog = adddriver.AddDriver(self)
        dialog.show()
        return
        
    def onSingleClick(self, in1):
        print("onSingleClick", in1.data())
        #subprocess.Popen(["cmd.exe", "/k title ABana"], creationflags=subprocess.CREATE_NEW_CONSOLE)
        self.selectedName = in1.data( Qt.UserRole + 1)
        
        