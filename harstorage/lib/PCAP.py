import os
import hashlib

from pylons import config

from harstorage.lib.pcap2har import *

class PCAP():

    def __init__(self):
        pass

    def store_pcap(self, pcap_data):
        self.hashname = hashlib.md5().hexdigest()
        temp_store = config["app_conf"]["temp_store"]
        filename = os.path.join(temp_store, self.hashname + ".pcap")
        
        with open(filename, "w+b") as file:
            file.write(pcap_data)

    def generate_har(self):
        temp_store = config["app_conf"]["temp_store"]

        inputfile = os.path.join(temp_store, self.hashname + ".pcap")
        outputfile = os.path.join(temp_store, self.hashname + ".har")

        # parse pcap file
        dispatcher = PacketDispatcher()
        pcap.ParsePcap(dispatcher, filename=inputfile)
        dispatcher.finish()

        # parse HAR stuff
        session = httpsession.HttpSession(dispatcher)

        #write the HAR file
        with open(outputfile, 'w') as f:
            json.dump(session, f, cls=har.JsonReprEncoder, indent=2, encoding='utf8', sort_keys=True)

    def get_har(self):
        temp_store = config["app_conf"]["temp_store"]

        inputfile = os.path.join(temp_store, self.hashname + ".har")
        with open(inputfile, "r") as file:
            return file.read()