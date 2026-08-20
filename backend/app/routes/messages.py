from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.database import get_db
from app.models.schema import Message, User
from app.services.auth_service import get_current_user

router = APIRouter()

class MessageSendRequest(BaseModel):
    receiver_id: int
    subject: str | None = None
    content: str

@router.post("/send", summary="Send a Secure Message")
def send_message(
    payload: MessageSendRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    receiver = db.query(User).filter(User.id == payload.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found.")
        
    new_msg = Message(
        sender_id=current_user.id,
        receiver_id=receiver.id,
        subject=payload.subject,
        content=payload.content,
        is_read=False
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    
    return {"message": "Message sent successfully", "message_id": new_msg.id}

@router.get("/my", summary="List My Messages")
def get_my_messages(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch messages where current user is either sender or receiver
    messages = db.query(Message).filter(
        or_(Message.sender_id == current_user.id, Message.receiver_id == current_user.id)
    ).order_by(Message.created_at.desc()).all()
    
    result = []
    for msg in messages:
        sender_user = db.query(User).filter(User.id == msg.sender_id).first()
        receiver_user = db.query(User).filter(User.id == msg.receiver_id).first()
        
        sender_name = sender_user.email.split('@')[0].replace('.', ' ').title() if sender_user else "Unknown Sender"
        receiver_name = receiver_user.email.split('@')[0].replace('.', ' ').title() if receiver_user else "Unknown Receiver"
        
        is_incoming = msg.receiver_id == current_user.id
        
        result.append({
            "id": msg.id,
            "sender_id": msg.sender_id,
            "receiver_id": msg.receiver_id,
            "sender_name": sender_name,
            "receiver_name": receiver_name,
            "subject": msg.subject,
            "content": msg.content,
            "is_read": msg.is_read,
            "is_incoming": is_incoming,
            "created_at": msg.created_at
        })
    return result

@router.put("/read/{message_id}", summary="Mark message as read")
def mark_as_read(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    msg = db.query(Message).filter(Message.id == message_id, Message.receiver_id == current_user.id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found or unauthorized.")
        
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    
    return {"message": "Message marked as read", "is_read": True}
