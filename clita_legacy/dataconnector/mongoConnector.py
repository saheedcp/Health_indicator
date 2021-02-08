import pymongo
import pandas as pd
from pymongo import *
from clita_legacy.errcode import errcode as err
class MongoConnector:
	client = None
        db     = None
	dbName = "bytematics"
	refCount = 0
	instance = None

        @classmethod
        def getInstance(cls):
                print "i am in instance"
		if cls.instance is None:
                    print "instance is none"
		    cls.instance = MongoConnector()
		return cls.instance
	
	def __init__(self, host='localhost', port=27017):
		try:
                    print "constructor mongo"
		    self.client = pymongo.MongoClient(host, port)
		except pymongo.errors.ConnectionFailure, e:
		   print "Could not connect to MongoDB: %s" % e

	def getDatabaseClient(self, name):
		self.db = self.client.get_database(name)
		if name in self.client.database_names():
			print 'Database ' + name + ' already exists'
			return self.db
		collection = self.db.get_collection("companyinfo");
                doc = {"name": "", "email": "", "phone": ""}
                collection.insert(doc)
		assert(name in self.client.database_names());
		return self.db
	def createCollection(self, name, options = None):
		collection = self.db.create_collection(name, options);
		assert(name in self.db.collection_names())

	def insertCollection(self, name, record):
		print "db", self.db, "name", name, "record", record
		collection = self.db.get_collection(name);
		if collection is None:
			print err.errDict["ERR_COLLECTION_NOT_FOUND"] % name
			return
		print "collection", collection, "db", self.db, "name", name, "record", record
		collection.insert(record)
		print "insertcollecion finished name", name, "record", record
	
	def updateCollection(self,key,value,name, record):
		print  "name", name,"key" ,key,"value", value,"record", record
		collection = self.db.get_collection(name);
		if collection is None:
			print err.errDict["ERR_COLLECTION_NOT_FOUND"] % name
			return
		print "collection", collection, "db", self.db, "name", name ,"record",record
		collection.update({key: value},record,upsert=True)
		#collection.update({key: value},record)
	
	def updateCollection_dash(self,updateDict,name, record):
		#print  "name", name,"key" ,key,"value", value,"record", record
		collection = self.db.get_collection(name);
		if collection is None:
			print err.errDict["ERR_COLLECTION_NOT_FOUND"] % name
			return
		print "collection", collection, "db", self.db, "name", name ,"record",record
		collection.update(updateDict,record,upsert=True)
		#collection.update({key: value},record)
	
	def removeCollection(self,updateDict,name):
		#print  "name", name,"key" ,key,"value", value,"record", record
		collection = self.db.get_collection(name);
		if collection is None:
			print err.errDict["ERR_COLLECTION_NOT_FOUND"] % name
			return
		print "collection", collection, "db", self.db, "name", name
		collection.remove(updateDict)
		#

	def getCollection(self, name):
		if name not in self.db.collection_names():
			print err.errDict["ERR_COLLECTION_NOT_FOUND"] % name
			return None
		return self.db.get_collection(name);

	def setDatabase(self, name):
		if name not in self.client.database_names():
			print name + ' database not found'
			return None
		self.db = self.client.get_database(name)

	def getDataFrame(self, name):
		collection = self.getCollection(name)
		if collection is None:
			print err.errDict["ERR_COLLECTION_NOT_FOUND"] % name
			return None
		docs = collection.find({}, {'_id':False})
		return pd.DataFrame(list(docs))

	def closeClient(self):
		print "closeClient", self.client
		self.client.close()

        def closeMongoClient(cls):
                print "closeMongoClient"
     		cls.instance.closeClient()

	def __del__(self):
                print "destructor"
		self.closeClient()

if __name__ == '__main__':
	mg = MongoConnector.getInstance()
        print "mg", mg
	mg1 = MongoConnector.getInstance()
        print "mg_1", mg1
	mg2 = MongoConnector.getInstance()
        print "mg_2", mg2
	mg3 = MongoConnector.getInstance()
        print "mg_3", mg3
	doc = {"name":"bytematics","email":"info@bytematics","phone":9663399357}
#	print mg.getCollection("test_new")
	mg.createDatabase("aaaaaaaaaaaa");
	mg.insertCollection("test", doc);
	mg.updateCollection("resourcename","resource_2", "resources", {"resourcename":"resource_2", "key" : 10})
#        while (1) :
#	 mg1 = MongoConnector.getInstance()
#	 time.sleep(1000)
 #    #    print mg1.getCollection("test")
