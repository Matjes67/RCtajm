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


class LapInfo(QDialog):

    def __init__(self, parent, name):
        super(LapInfo, self).__init__(parent)
        self.parent = parent
        self.name = name
        self.initUI()
        
    def initUI(self):

        self.ui = uic.loadUi(SRC_PATH+os.sep+'lapinfo.ui', self)
        self.setWindowTitle("LapInfo "+self.name)
        
        #self.ui.buttonEdit.clicked.connect(self.onButtonEditDriver)
        #self.ui.buttonAddNew.clicked.connect(self.onButtonNewDriver)
        
        #self.ui.tableView.clicked.connect(self.onSingleClick)

        self.createModel()

    def createModel(self):
        
        self.model = QStandardItemModel()

        counter = 0
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "Lap" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "transponder" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "LapTime" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "Hits" ) )
        counter+=1
        self.model.setHorizontalHeaderItem( counter, QStandardItem( "Strength" ) )


        for times in self.parent.timeList:
            if times["driver"] == self.name:
                for lap in times["history"]:

                    lapnr = lap["lap"]
                    coldlap = QStandardItem( str(lapnr) )
                    coldlap.setData( lapnr,  Qt.UserRole + 1)
                    coldlap.setEditable(False)

                    coltran = QStandardItem( lap["transponder"] )
                    coltran.setData( lapnr,  Qt.UserRole + 1)
                    coltran.setEditable(False)

                    coltime = QStandardItem( f"{lap['lapTime']:.4}" )
                    coltime.setData( lapnr,  Qt.UserRole + 1)
                    coltime.setEditable(False)

                    colhits = QStandardItem( str(lap["hits"]) )
                    colhits.setData( lapnr,  Qt.UserRole + 1)
                    colhits.setEditable(False)

                    colstre = QStandardItem( str(lap["strength"]) )
                    colstre.setData( lapnr,  Qt.UserRole + 1)
                    colstre.setEditable(False)

                    rowlist = [ coldlap, coltran, coltime, colhits, colstre ]

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
        
        