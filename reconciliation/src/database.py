import os
import re
from pymilvus import MilvusClient
from sentence_transformers import SentenceTransformer


class MilvusReconciler:
    def __init__(self, db_path=None):
        # 1. Data Path
        if db_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_path = os.path.join(base_dir, "data", "vector_db.db")

        os.makedirs(os.path.dirname(db_path), exist_ok=True)

        # 2. Load model
        self.model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
        self.collection = "reconciliation"

        # 3. Milvus Connection
        self.client = MilvusClient(db_path)

    def process_and_store(self, final_string_output):
        blocks = [block.strip() for block in final_string_output.split('---') if block.strip()]
        reconcle_list = []
        full_metadata_list = []

        for block in blocks:
            match = re.search(r"Thông tin đối soát:\s*(.*?)(?=Chi tiết giao dịch:|$)", block, re.DOTALL)
            if match:
                reconcle_list.append(match.group(1).strip())
                full_metadata_list.append(block)

        if not reconcle_list:
            return

        if self.client.has_collection(self.collection):
            self.client.drop_collection(self.collection)

        self.client.create_collection(
            collection_name=self.collection,
            dimension=384,
            metric_type="COSINE",
            auto_id=True
        )

        # 4. Encoding Vector and insert to Milvus
        embeddings = self.model.encode(reconcle_list)
        insert_data = [
            {"vector": embeddings[i], "metadata_detail": full_metadata_list[i]}
            for i in range(len(reconcle_list))
        ]
        self.client.insert(collection_name=self.collection, data=insert_data)

    def search(self, query_text):
        query_vector = self.model.encode([query_text.strip()])
        results = self.client.search(
            collection_name=self.collection,
            data=query_vector,
            limit=1,
            output_fields=["metadata_detail"]
        )
        return results[0] if results else []

    def close(self):
        if hasattr(self, 'client'):
            self.client.close()