import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MedTwinNotification")

def push_realtime_notification(recipient_role: str, recipient_id: int, title: str, message: str, is_emergency: bool = False):
    """
    Notification Service — Pushes alerts to patient/doctor in real time (Slide 11 & 20).
    In full production, this triggers WebSocket updates or push notifications via Firebase/Pusher.
    """
    alert_level = "🚨 [EMERGENCY CRITICAL ALERT]" if is_emergency else "🔔 [Notification]"
    logger.info(f"{alert_level} -> {recipient_role.upper()} (ID: {recipient_id}) | {title}: {message}")
    return {"status": "sent", "recipient_id": recipient_id, "is_emergency": is_emergency}
