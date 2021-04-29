RCtajm
======

RC Tajm (pronounced rc time, almost) The simple lap time software. 

Work in progress, not much is working at the moment.

This project is multi platform and should work on linux on a normal computer x86 or x86_64. And on ARM devices such as  Raspberry Pi

Main focus is on creating a simple to use system that is working on all types of computers. This project will NOT be one with super complex databases to keep track of 500 drivers and sync online and all that crap that makes other timing softwares stupid hard to get running. 



Design goals
=======================

Current design goal is to just create a working base where you can keep track on practice times. 

Future goals
=======================

Some simple race tracking


Hardware compatibility
=======================
Modular design on hardware classes makes it easy to write support for new hardware.

Currently supported hardware:
* Hourglass home made decoder
* AMB Rc2 or similar with serial interface


Install on Debian
=================

 apt install git python3-pyqt5 python3-pip python3-serial 
 pip3 install dominate