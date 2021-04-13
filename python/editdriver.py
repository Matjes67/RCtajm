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



class EditDriver(QDialog):

    def __init__(self, parent=None):
        super(EditDriver, self).__init__(parent)
        
        self.initUI()
        
    def initUI(self):

        self.ui = uic.loadUi(SRC_PATH+os.sep+'editdriver.ui', self)
        self.setWindowTitle("Edit Driver")