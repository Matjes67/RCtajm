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
* pacman -S nodejs git python2 mongodb base-devel iw mpg123 hostapd dnsmasqd
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

First test if your wifi dongle can handle wifi in AP mode. 

`iw list`

Look for the "Supported interface modes:" there must be  a line with AP for this to work.

```
[root@rctajm create_ap]# iw list
Wiphy phy0
        max # scan SSIDs: 4
        max scan IEs length: 2257 bytes
        Coverage class: 0 (up to 0m)
        Device supports RSN-IBSS.
        Supported Ciphers:
                * WEP40 (00-0f-ac:1)
                * WEP104 (00-0f-ac:5)
                * TKIP (00-0f-ac:2)
                * CCMP (00-0f-ac:4)
        Available Antennas: TX 0 RX 0
        Supported interface modes:
                 * IBSS
                 * managed
                 * AP
                 * AP/VLAN
                 * WDS
                 * monitor
                 * mesh point
.... etc ....
````

Get create_ap script from github. 
```
cd
git clone https://github.com/oblique/create_ap.git
cd create_ap
```

Test the command create_ap to find a setting that works for you. Then when you have found a setting that works edit create_ap.service line to match your wifi settings. For ex:
`create_ap -c 6  wlan0 eth0 RCtajm --no-virt` will create a wifi called RCtajm on wifi frequency channel 6, the --no-virt setting is something my hardware needed, I'm using cheap wifi usb dongles from ebay. 

`nano create_ap.service`

```[Unit]
Description=Create AP Service

[Service]
Type=simple
ExecStart=/usr/bin/bash create_ap -c 6  wlan0 eth0 RCtajm --no-virt
ExecStop=pkill hostapd
KillSignal=SIGINT
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target


```

Enable and start the ap mode
```
systemctl enable create_ap.service
systemctl start create_ap.service
```


Repairing mongodb
=================

after powerfailure or other unexpected shutdown mongodb may fail to start.

```
rm /var/lib/mongodb/mongod.lock
mongod --repair --config /etc/mongodb.conf
chown -R mongodb /var/lib/mongodb
```

