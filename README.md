RCtajm
======

RC Tajm (pronounced rc time)

Work in progress, nothing is working at the moment.

This project is multi platform and should work on linux on a normal computer x86 or x86_64. And on ARM devices such as Beaglebone and Raspberry Pi


Install on Raspberry Pi
=======================

Download and install arch linux to a sd card. follow guide on raspberrys homepage.

* pacman -Suy
* reboot
* pacman -S nodejs git python2 mongodb base-devel iw
* node -v
* npm -v
* systemctl enable mongodb
* systemctl start mongodb
* cd 
* git clone https://github.com/condac/RCtajm.git
* cd RCtajm/alpha0
* ln -s /usr/bin/python2 /usr/bin/python
* npm install
* DEBUG=alpha0 ./bin/www

