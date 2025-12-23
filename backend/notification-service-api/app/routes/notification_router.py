from typing import Annotated, Optional
from app.auth.auth import AuthUser, RoleChecker
from app.auth.onetime_token import internal_auth_dependency
from app.models.notification_model import (
    SendListNotificationReq,
    SendNotificationReq,
)
from app.schemas.base import AppBaseResponse
from app.schemas.notification_schema import GetNotificationReq
from app.services import notification_service
from fastapi import APIRouter, Depends, Query, Request, Body

router = APIRouter()

BASE_URL = "/notifications"
router = APIRouter(prefix=BASE_URL)


@router.get("/{id}")
async def get_by_id(user: Annotated[AuthUser, Depends(RoleChecker())], id: str):
    noti = await notification_service.get_by_id(id, user.user_id)

    return AppBaseResponse(noti).to_dict()


@router.get("")
async def get_by_filter(
    user: Annotated[AuthUser, Depends(RoleChecker())],
    keyword: Optional[str] = None,
    status: Optional[list[str]] = Query(None),
    page: Optional[int] = 1,
    page_size: Optional[int] = 10,
):
    noti = await notification_service.get_by_filter(
        GetNotificationReq(
            keyword=keyword, page=page, page_size=page_size, status=status
        ),
        user.user_id,
        user.user_id,
    )

    return AppBaseResponse(noti).to_dict()


@router.post("/send")
async def send(
    request: Request,
    _=Depends(internal_auth_dependency),
    body: SendNotificationReq = Body(...),
):
    broker = request.app.state.broker

    await notification_service.send_notification_to_sse(broker, body.noti_id)

    return AppBaseResponse().to_dict()


@router.post("/send-list")
async def send(
    request: Request,
    _=Depends(internal_auth_dependency),
    body: SendListNotificationReq = Body(...),
):
    broker = request.app.state.broker

    await notification_service.send_notifications_to_sse(broker, body.noti_ids)

    return AppBaseResponse().to_dict()


# @router.post("/get-token")
# async def send():
#     token = create_token("noti", "noti", config.INTERNAL_SECRET_KEY, 60)

#     return AppBaseResponse({"token": token}).to_dict()
