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


Installing Wifi AP mode
=======================

* pacman -S hostapd dnsmasqd
* nano /etc/hostapd/hostapd.conf

  ssid=RCtajm
  #wpa_passphrase=Somepassphrase
  interface=wlan0
  bridge=br0
  auth_algs=3
  channel=2
  driver=nl80211
  hw_mode=g
  logger_stdout=-1
  logger_stdout_level=2
  max_num_sta=5
  rsn_pairwise=CCMP
  #wpa=2
  #wpa_key_mgmt=WPA-PSK
  #wpa_pairwise=TKIP CCMP

