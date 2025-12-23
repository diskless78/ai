from typing import Optional, List, Dict, Any
import uuid
from pydantic import BaseModel, Field, field_validator
from enum import Enum
from datetime import datetime
from bson import Binary, UUID_SUBTYPE

from app.configs import config
from app.core import s3_minio
from app.db.redis import get_from_cache, set_to_cache


class NotificationStatus(str, Enum):
    info = "info"
    warning = "warning"
    critical = "critical"


class NotificationType(str, Enum):
    product_zone_overcrowded = "product_zone_overcrowded"
    checkout_delay = "checkout_delay"
    long_queue_detected = "long_queue_detected"
    unattended_items_detected = "unattended_items_detected"
    smoke_fire_detected = "smoke_fire_etected"
    traffic_insight = "traffic_insight"

    # Thông báo chung
    info = "info"
    undefine = "undefine"


class Notification(BaseModel):
    id: str = Field(..., alias="_id")  # bytes
    title: str
    message: str
    image: Optional[str] = None
    box_id: str
    cam_id: str

    params: Dict[str, Any]

    status: NotificationStatus
    # type: NotificationType

    users_read: List[str] = Field(default_factory=list)
    users_delete: List[str] = Field(default_factory=list)

    has_for_all: bool

    tenant_id: Optional[str] = Field(default=None)
    user_id: Optional[str] = Field(default=None)
    store_ids: List[str] = Field(default_factory=list)

    created_at: datetime
    updated_at: datetime

    @field_validator("id", mode="before")
    def convert_bson_uuid(cls, v):
        """
        Convert MongoDB Binary(UUID) -> string UUID
        """
        if isinstance(v, Binary) and v.subtype == UUID_SUBTYPE:
            return str(uuid.UUID(bytes=v))
        if isinstance(v, (bytes, bytearray)):  # fallback
            return str(uuid.UUID(bytes=v))
        return v

    class Config:
        populate_by_name = True  # Cho phép parse theo _id
        arbitrary_types_allowed = True


class NotificationData(BaseModel):
    cam_id: str = Field(...)
    zone_id: str = Field(...)

    image: Optional[str] = None
    duration_second: Optional[int] = None
    people_count: Optional[int] = None
    avg_dwell_time: Optional[int] = None

    class Config:
        populate_by_name = True


class NotificationRes(BaseModel):
    id: str = Field(..., alias="_id")
    title: Optional[str] = None
    message: Optional[str] = None
    image: Optional[str] = None
    params: Dict[str, Any]
    # data: Dict[str, Any]
    status: NotificationStatus
    # type: NotificationType
    created_at: datetime
    is_read: bool

    @field_validator("id", mode="before")
    def convert_bson_uuid(cls, v):
        """
        Convert MongoDB Binary(UUID) -> string UUID
        """
        if isinstance(v, Binary) and v.subtype == UUID_SUBTYPE:
            return str(uuid.UUID(bytes=v))
        if isinstance(v, (bytes, bytearray)):  # fallback
            return str(uuid.UUID(bytes=v))
        return v

    class Config:
        populate_by_name = True  # Cho phép parse theo _id
        arbitrary_types_allowed = True


def to_notification_res(data: dict, user_id: str = None) -> dict:
    is_read = user_id in data.get("users_read") if user_id else False

    created_at = data.get("created_at")
    if isinstance(created_at, datetime):
        created_at = created_at.isoformat() + "+00:00"

    filename = data.get("image")
    # Tạo cache key duy nhất

    # image
    image = ""

    if filename:
        cache_key = f"notification:{filename}"
        # Kiểm tra cache
        cached_image = get_from_cache(cache_key)
        if cached_image:
            image = cached_image
        else:
            expires_hour = 2

            # Cache miss: thực hiện truy vấn (giả lập dữ liệu trả về)
            image = s3_minio.get_url(
                config.MINIO_NOTIFICATION_BUCKET, filename, expires_hour
            )

            # Lưu dữ liệu vào cache
            set_to_cache(cache_key, image, ttl=expires_hour * 60 * 60)  # TTL giây

    record = NotificationRes(
        id=data.get("_id"),
        title=data.get("title"),
        message=data.get("message"),
        image=image,
        params=data.get("params"),
        status=data.get("status"),
        type=data.get("type"),
        is_read=is_read,
        created_at=created_at,
    )

    return record.dict()


class SendNotificationReq(BaseModel):
    noti_id: str = Field(...)


class SendListNotificationReq(BaseModel):
    noti_ids: list[str] = Field(...)
