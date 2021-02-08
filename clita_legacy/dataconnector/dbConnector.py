import mongoConnector

#TODO: We should not expose MongoConnector object
class dbConnector:
	db = None

	def setDatabaseClient(self, dbconfig=None):
		self.db = mongoConnector.MongoConnector()
		print "dbconfig", dbconfig['dbname']
		if dbconfig is not None:
			self.db.setDatabase(dbconfig['dbname'])

	def getDatabaseClient(self):
		return self.db



if __name__ == '__main__':
	dbConnector.setDatabaseClient()
	client = dbConnector.getDatabaseClient()
	print client.getCollection("collection_company")
