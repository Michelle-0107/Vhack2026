"""
Database - Persistence layer for mission logs, drone telemetry, and survivor records.
Supports MongoDB via pymongo.
"""
from vhack_engine.config.settings import Settings


class Database:
    """
    Provides read/write access to the MongoDB database.
    """

    def __init__(self):
        self.settings = Settings()
        self._client = None
        self._db = None

    def connect(self):
        """Establish a connection to MongoDB."""
        try:
            import pymongo
            self._client = pymongo.MongoClient(self.settings.MONGODB_URI)
            self._db = self._client[self.settings.DB_NAME]
        except Exception as e:
            print(f"[Database] Connection failed: {e}")

    def insert(self, collection: str, document: dict) -> str | None:
        """Insert a document and return its ID."""
        if self._db is None:
            return None
        result = self._db[collection].insert_one(document)
        return str(result.inserted_id)

    def find(self, collection: str, query: dict) -> list[dict]:
        """Return documents matching the query."""
        if self._db is None:
            return []
        return list(self._db[collection].find(query))

    def close(self):
        """Close the database connection."""
        if self._client:
            self._client.close()
