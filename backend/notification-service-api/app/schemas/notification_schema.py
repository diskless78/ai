from typing import Optional

from app.schemas.base import BasePagingReq


class GetNotificationReq(BasePagingReq):
    status: Optional[list[str]] = None
