import json
import redis

from app.configs import config

redis_client = redis.Redis(
    host=config.REDIS_HOST,
    port=config.REDIS_PORT,
    db=config.REDIS_DATABASE,
    password=config.REDIS_PASSWORD,
)


# Hàm cache
def get_from_cache(key: str):
    data = redis_client.get(key)
    if data:
        return json.loads(data)  # Chuyển đổi từ chuỗi JSON về Python object
    return None


# ttl tính bằng giây
def set_to_cache(key: str, value: dict, ttl: int = 60):
    redis_client.set(
        key, json.dumps(value), ex=ttl
    )  # Chuyển đổi sang chuỗi JSON trước khi lưu


def remove_from_cache(key: str):
    redis_client.delete(key)


def is_nonce_used(nonce: str) -> bool:
    return redis_client.exists(nonce) == 1


def mark_nonce_used(nonce: str) -> None:
    redis_client.set(nonce, "1", ex=60)  # TTL 60s
