
import paho.mqtt.client as mqtt #import the client1
import time
from clita_legacy.dataconnector import mongoConnector
from clita_legacy.serverlogging.clita_log import clitaLogger
from datetime import datetime
class MQTTConnector:
	def __init__(self):
		broker_address='127.0.0.1'
		try:
			self.client = mqtt.Client("P1")
			self.client.on_message=self.on_message#attach function to callback
			self.client.connect(broker_address)
		except:
			print "Could not connect"
		self.test()


	def on_message(self,client, userdata, message):
		mg = mongoConnector.MongoConnector.getInstance()
		tmpDict = dict()
        	db= mg.getDatabaseClient('production')
		tmpDict["datetime"] = datetime.today()
		tmpDict["eventCount"] = 1
        	mg.updateCollection_dash(tmpDict,"productionEvents" ,tmpDict)
		print tmpDict

    		print("message received " ,str(message.payload.decode("utf-8")))
    		print("message topic=",message.topic)
    		print("message qos=",message.qos)
    		print("message retain flag=",message.retain)
	def test(self):
		self.client.loop_start() #start the loop
		self.client.subscribe("test_1")
		self.client.publish("test_1","OFF")
		print self.client,"client"
		time.sleep(400000)
		self.client.loop_stop()

con = MQTTConnector()
