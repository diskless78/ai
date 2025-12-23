# sse/broker.py
import asyncio
from typing import Dict


class Event:
    def __init__(self, name: str, data: str):
        self.name = name
        self.data = data


class Client:
    def __init__(self, client_id: str, token: str):
        self.client_id = client_id
        self.token = token
        self.queue: asyncio.Queue[Event] = asyncio.Queue(maxsize=100)


class SendRequest:
    def __init__(self, user_id: str, event: Event):
        self.user_id = user_id
        self.event = event


class Broker:
    def __init__(self):
        self.clients: Dict[str, Client] = {}

        self.register = asyncio.Queue()
        self.unregister = asyncio.Queue()
        self.broadcast = asyncio.Queue()
        self.send_to_user_event = asyncio.Queue()

        self.lock = asyncio.Lock()
        self.shutdown = False

        asyncio.create_task(self.run())

    def _get_user_id(self, client_id: str) -> str:
        return client_id.split("_")[0]

    async def run(self):
        while not self.shutdown:
            await asyncio.sleep(0)

            if not self.register.empty():
                client = await self.register.get()
                async with self.lock:
                    self.clients[client.client_id] = client
                continue

            if not self.unregister.empty():
                client = await self.unregister.get()
                async with self.lock:
                    self.clients.pop(client.client_id, None)
                continue

            if not self.send_to_user_event.empty():
                req = await self.send_to_user_event.get()
                await self._send_to_user(req)
                continue

            if not self.broadcast.empty():
                event = await self.broadcast.get()
                await self._broadcast(event)
                continue

            await asyncio.sleep(0.01)

        await self._force_disconnect_all()

    async def get_clients_of_user(self, user_id: str) -> list[Client] | None:
        async with self.lock:
            clients = [
                client
                for client_id, client in self.clients.items()
                if self._get_user_id(client_id) == user_id
            ]

            return clients

    async def send_to_all(self, event: Event):
        await self.broadcast.put(event)

    async def send_to_user(self, user_id: str, event: Event):
        await self.send_to_user_event.put(SendRequest(user_id, event))

    async def send_to_users(self, user_ids: list[str], event: Event):
        async with self.lock:
            # tìm user có user_id trùng
            clients = [
                client
                for client_id, client in self.clients.items()
                if self._get_user_id(client_id) in user_ids
            ]

        if not clients:
            return

        for client in clients:
            try:
                client.queue.put_nowait(event)
            except asyncio.QueueFull:
                await self.unregister.put(client)

    async def _broadcast(self, event: Event):
        async with self.lock:
            clients = list(self.clients.values())

        for client in clients:
            try:
                client.queue.put_nowait(event)
            except asyncio.QueueFull:
                await self.unregister.put(client)

    async def _send_to_user(self, req: SendRequest):
        async with self.lock:

            # tìm user có user_id trùng
            clients = [
                client
                for client_id, client in self.clients.items()
                if self._get_user_id(client_id) == req.user_id
            ]

        if not clients:
            return

        for client in clients:
            try:
                client.queue.put_nowait(req.event)
            except asyncio.QueueFull:
                await self.unregister.put(client)

    async def _force_disconnect_all(self):
        async with self.lock:
            for client in self.clients.values():
                client.queue.put_nowait(None)
            self.clients.clear()

    async def stop(self):
        self.shutdown = True
        await self._force_disconnect_all()
