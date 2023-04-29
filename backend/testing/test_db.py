import unittest
from pymongo.errors import BulkWriteError
from db_connection import Database

class TestDatabase(unittest.TestCase):
    
    def setUp(self):
        self.db = Database()
        
    def test_connection(self):
        self.assertTrue(self.db.cluster is not None)
    