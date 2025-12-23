import asyncio
from typing import Annotated
from app.auth.auth import AuthUser, RoleChecker
from app.core.sse.broker import Client
from fastapi import APIRouter, Request, Depends, Header
from fastapi.responses import StreamingResponse

router = APIRouter()

BASE_URL = "/sse"
router = APIRouter(prefix=BASE_URL)


# SSE
@router.get("")
async def sse_endpoint(
    request: Request,
    user: Annotated[AuthUser, Depends(RoleChecker())],
    authorization: str = Header(None),
):
    broker = request.app.state.broker

    client_id = f"{user.user_id}_{authorization}"

    client = Client(client_id=client_id, token=authorization)

    await broker.register.put(client)

    async def event_stream():
        try:
            while True:
                if await request.is_disconnected():
                    break

                event = await client.queue.get()
                if event is None:
                    break

                yield f"event: {event.name}\ndata: {event.data}\n\n"

        except asyncio.CancelledError:
            pass
        finally:
            await broker.unregister.put(client)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
    )
