import os
from pathlib import Path
from dotenv import load_dotenv
import pymongo

# --- 核心修复：精准定位根目录的 .env ---
# 无论你在哪个文件夹运行，都会强制查找 vhack_engine 的父目录下的 .env
base_dir = Path(__file__).resolve().parent.parent.parent
dotenv_path = base_dir / ".env"
load_dotenv(dotenv_path=dotenv_path)

class Database:
    def __init__(self):
        # 从环境变量读取，如果读不到则报错，不再默认 localhost
        self.uri = os.getenv("MONGODB_URI")
        self.db_name = os.getenv("DB_NAME")
        self._client = None
        self._db = None

        if not self.uri:
            raise ValueError("❌ 错误：在 .env 中未找到 MONGODB_URI，请检查文件位置！")

    def connect(self):
        try:
            self._client = pymongo.MongoClient(self.uri)
            self._db = self._client[self.db_name]
            # 简单测试一下连接
            self._client.admin.command('ping')
            print(f"📡 成功通过配置连接至云端数据库: {self.db_name}")
        except Exception as e:
            print(f"❌ 数据库连接失败: {e}")
            raise e

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

    def vector_search(self, collection: str, query_vector: list[float], limit: int = 2) -> list[dict]:
        """
        执行 MongoDB Atlas Vector Search
        :param collection: 表名 (例如 'sops')
        :param query_vector: 经过大模型转换后的数字向量 (list of floats)
        :param limit: 返回最相关的几条结果
        """
        print(f"📡 正在尝试检索数据库: {self._db.name}")
        print(f"📋 正在检索表: {collection}")

        if self._db is None:
            return []
            
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index", # 这是我们等下要在网页端建的索引名字
                    "path": "embedding",     # 存放向量的字段名
                    "queryVector": query_vector,
                    "numCandidates": 10,     # 候选数量 (通常设为 limit 的 5-10 倍)
                    "limit": limit
                }
            },

            {
                # 决定返回哪些字段 (1 代表返回，0 代表不返回)
                "$project": {
                    "_id": 0,
                    "rule_text": 1,
                    "score": { "$meta": "vectorSearchScore" } # 返回相似度分数
                }
            }
        ]
        try:
            res = list(self._db[collection].aggregate(pipeline))
            return res
        except Exception as e:
            # 打印最详细的错误详情
            print(f"🔥 底层报错详情: {getattr(e, 'details', '无详细信息')}")
            raise e
        return list(self._db[collection].aggregate(pipeline))

    def close(self):
        """Close the database connection."""
        if self._client:
            self._client.close()

    def update_drone_status(self, drone_id: str, update_data: dict):
        """更新无人机实时状态 (Upsert 模式)"""
        if self._db is None: return
        self._db["drones"].update_one(
            {"drone_id": drone_id},
            {"$set": update_data},
            upsert=True
        )

    def log_event(self, event_type: str, details: str):
        """向黑匣子写入一条任务日志"""
        from datetime import datetime
        doc = {
            "timestamp": datetime.now(),
            "type": event_type,
            "details": details
        }
        self.insert("mission_events", doc)