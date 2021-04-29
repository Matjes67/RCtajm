#!/usr/bin/python3
import sys
import os
SRC_PATH = os.path.dirname(os.path.abspath(__file__))
sys.path.append(SRC_PATH+os.sep+'../common')

import dominate
from dominate.tags import *


from common import *

class Report():
    def __init__(self, parent):
        super(Report,self).__init__()
        self.parent = parent



    def createHTML(self):
        doc = dominate.document(title='RC Tajm')

        with doc:
            with div():
                attr(cls='body')
                h1('Practice times')
        
        with doc: 
            style("table{border-collapse:collapse}")
            style("th{font-size:small;border:1px solid gray;padding:4px;background-color:#DDD}")
            style("td{font-size:small;text-align:center;border:1px solid gray;padding:4px}")
                       
            with table():
                with thead():
                    th("Driver")
                    th("transponder")
                    th("Time")
                    th("Laps")
                    th("LastLap")
                    th("BestLap")
                    th("Hits")
                    th("Strength")
                with tbody():
                    #with tr(): #Row 1
                        # td("driver")
                        # td("transponder")
                        # td("time")
                        # td("laps")
                        # td("lapTime")
                        # td("bestLap")
                        # td("hits")
                        # td("strength")
                    for ff in self.parent.timeList:
                        #print(ff)
                        with tr(): #Row 1
                            #td(ff["driver"])
                            td( a(ff["driver"], href='./drivers/'+ff["driver"]+".html") )
                            td(ff["transponder"])
                            td( timeFormat(ff['time']) )
                            td(ff["laps"])
                            td( timeFormat(ff['lapTime']) )
                            td( timeFormat(ff['bestLap']) )
                            td(ff["hits"])
                            td(ff["strength"])
                
                                    
        
        #print(doc)
        f = open("../html/index.html", "w")
        f.write(doc.render())
        f.close()
        
        for driver in self.parent.drivers.getListOfDrivers():
            doc = dominate.document(title='RC Tajm')

            with doc:
                with div():
                    attr(cls='body')
                    h1('Practice times '+driver)
            
            with doc: 
                style("table{border-collapse:collapse}")
                style("th{font-size:small;border:1px solid gray;padding:4px;background-color:#DDD}")
                style("td{font-size:small;text-align:center;border:1px solid gray;padding:4px}")
                           
                with table():
                    with thead():
                        th("Lap")
                        th("transponder")
                        th("Time")
                        th("Hits")
                        th("Strength")
                    with tbody():
                        for times in self.parent.timeList:
                            if times["driver"] == driver:
                                for ff in times["history"]:
                                    with tr(): 
                                        td(ff["lap"])
                                        td(ff["transponder"])
                                        td( timeFormat(ff['lapTime']) )
                                        td(ff["hits"])
                                        td(ff["strength"])

            f = open("../html/drivers/"+driver+".html", "w")
            f.write(doc.render())
            f.close()
        
