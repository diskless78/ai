import json

from fastapi.encoders import jsonable_encoder
from app.constants.enum import NOTIFY_KEY
from app.core.sse.broker import Broker, Event
from app.models.notification_model import to_notification_res
from app.repositories import notification_repo
from app.schemas.notification_schema import GetNotificationReq


async def get_by_id(id_str: str, user_id: str) -> dict | None:
    return await notification_repo.get_by_id(id_str, user_id)


async def get_by_filter(
    params: GetNotificationReq, tenant_id: str, user_id: str
) -> dict:
    return await notification_repo.get_by_filter(params, tenant_id, user_id)


async def get_all_info_by_id(id_str: str) -> dict:
    return await notification_repo.get_all_info_by_id(id_str)


async def send_notifications_to_sse(broker: Broker, noti_ids: list[str]) -> dict:
    for noti_id in noti_ids:
        await send_notification_to_sse(broker, noti_id)


async def send_notification_to_sse(broker: Broker, noti_id: str) -> dict:
    noti = await notification_repo.get_all_info_by_id(noti_id)

    if noti is None:
        return
    # Nếu có user_id là gửi cho 1 user
    user_id = noti.get("user_id")
    store_ids = noti.get("tenant_id")
    tenant_id = noti.get("store_ids")

    if user_id:
        # kiểm tra user có kết nối vào SSE
        await broker.send_to_users(
            [user_id],
            Event(
                NOTIFY_KEY.NOTIFY.value,
                json.dumps(jsonable_encoder(to_notification_res(noti, user_id))),
            ),
        )

    # TODO
    # nếu có store_ids là gửi cho các user trong store
    elif store_ids:
        # lấy danh sách user theo store_ids
        # await broker.send_to_users(
        #     user_ids,
        #     Event(
        #         NOTIFY_KEY.NOTIFY.value,
        #         json.dumps(jsonable_encoder(to_notification_res(noti))),
        #     ),
        # )
        ...

    # nếu có tenant_id là gửi cho các user trong tenant
    elif tenant_id:
        # TODO: lấy tất cả user của tenant và gửi thông báo
        # await broker.send_to_users(
        #     user_ids,
        #     Event(
        #         NOTIFY_KEY.NOTIFY.value,
        #         json.dumps(jsonable_encoder(to_notification_res(noti))),
        #     ),
        # )

        await broker.send_to_user(
            tenant_id,
            Event(
                NOTIFY_KEY.NOTIFY.value,
                json.dumps(jsonable_encoder(to_notification_res(noti))),
            ),
        )

    # gửi cho tất cả user
    else:
        await broker.send_to_all(
            Event(
                NOTIFY_KEY.NOTIFY.value,
                json.dumps(jsonable_encoder(to_notification_res(noti))),
            ),
        )
