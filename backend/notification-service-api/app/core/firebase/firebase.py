from typing import Dict, List, Optional
from app.configs import config
import firebase_admin
from firebase_admin import credentials, messaging


class Firebase:
    messaging = None

    @classmethod
    def init(cls):
        if firebase_admin._apps:
            return

        if config.GOOGLE_APPLICATION_CREDENTIALS:
            cred = credentials.Certificate(config.GOOGLE_APPLICATION_CREDENTIALS)
            firebase_admin.initialize_app(cred)
        else:
            firebase_admin.initialize_app()

        cls.messaging = messaging


class FirebaseService:
    @staticmethod
    def send(
        tokens: List[str],
        title: str,
        body: str,
        data: Optional[dict[str, str]] = None,
    ) -> dict:
        message = messaging.MulticastMessage(
            tokens=tokens,
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
        )

        response = Firebase.messaging.send_multicast(message)

        return {
            "success": response.success_count,
            "failure": response.failure_count,
        }
    