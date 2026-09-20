import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Loader2, CheckCheck, ArrowLeft, User, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MessagesList() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]); // Doctors for Patient, Patients for Doctor
  const [loading, setLoading] = useState(true);
  
  const [activeContact, setActiveContact] = useState(null); // ID of the currently selected contact
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.get(`${baseUrl}/api/messages/my`);
      // Sort ascending so older messages are at the top, newer at the bottom
      const sorted = res.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setMessages(sorted);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      if (user?.role === 'patient') {
        const res = await axios.get(`${baseUrl}/api/doctor/all`);
        setContacts(res.data.map(d => ({ id: d.user_id, name: d.name })));
      }
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchContacts();
  }, [user]);

  // Derive unique contacts for doctor from message history if not a patient
  useEffect(() => {
    if (user?.role === 'doctor' && messages.length > 0) {
      const uniquePatients = new Map();
      messages.forEach(msg => {
        if (msg.sender_id !== user.id) uniquePatients.set(msg.sender_id, msg.sender_name);
        if (msg.receiver_id !== user.id) uniquePatients.set(msg.receiver_id, msg.receiver_name);
      });
      setContacts(Array.from(uniquePatients, ([id, name]) => ({ id, name })));
    }
  }, [messages, user]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContact]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeContact || !content.trim()) return;
    
    setSending(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      await axios.post(`${baseUrl}/api/messages/send`, {
        receiver_id: activeContact,
        subject: "Secure Message",
        content: content
      });
      setContent('');
      fetchMessages();
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      await axios.put(`${baseUrl}/api/messages/read/${id}`);
      // Optimistically update local state so we don't spam the endpoint
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch (err) {
      console.error('Error marking as read', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  // Filter messages for the currently active chat
  const activeMessages = messages.filter(
    m => m.sender_id === activeContact || m.receiver_id === activeContact
  );

  // Get the active contact object for header details
  const activeContactObj = contacts.find(c => c.id === activeContact);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex h-[600px] overflow-hidden animate-fade-in">
      
      {/* Sidebar: Chat List */}
      <div className={`w-full sm:w-[320px] lg:w-[380px] flex flex-col border-r border-slate-200 bg-white ${activeContact ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <h3 className="text-slate-900 font-bold text-lg">Chats</h3>
          <p className="text-xs text-slate-500 mt-1">End-to-end encrypted messaging</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-10">No contacts available.</p>
          ) : (
            contacts.map(contact => {
              // Get the last message for this contact to show in the preview
              const contactMessages = messages.filter(m => m.sender_id === contact.id || m.receiver_id === contact.id);
              const lastMessage = contactMessages.length > 0 ? contactMessages[contactMessages.length - 1] : null;
              // Check for unread messages from this contact
              const unreadCount = contactMessages.filter(m => m.is_incoming && !m.is_read).length;

              return (
                <div 
                  key={contact.id}
                  onClick={() => setActiveContact(contact.id)}
                  className={`p-3 flex items-center gap-3 cursor-pointer border-b border-slate-100 transition-colors ${activeContact === contact.id ? 'bg-sky-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                    <User className="w-6 h-6 text-slate-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 truncate text-sm">{contact.name}</h4>
                      {lastMessage && (
                        <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                          {new Date(lastMessage.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-xs truncate ${unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                        {lastMessage ? (
                          <>
                            {!lastMessage.is_incoming && (
                              <CheckCheck className={`inline w-3 h-3 mr-1 ${lastMessage.is_read ? 'text-sky-500' : 'text-slate-400'}`} />
                            )}
                            {lastMessage.content}
                          </>
                        ) : 'Start a conversation'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Pane */}
      <div className={`flex-1 flex flex-col bg-[#f0f2f5] relative ${!activeContact ? 'hidden sm:flex' : 'flex'}`}>
        
        {!activeContact ? (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-sky-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">MedTwin Secure Chat</h3>
            <p className="text-sm max-w-sm">Select a contact from the menu to view your conversation or start a new message.</p>
          </div>
        ) : (
          // Active Chat
          <>
            {/* Chat Header */}
            <div className="p-3 bg-white border-b border-slate-200 flex items-center gap-3 shadow-sm shrink-0 relative z-10">
              <button 
                onClick={() => setActiveContact(null)}
                className="sm:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                <span className="text-sky-600 font-bold text-sm">
                  {activeContactObj?.name?.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{activeContactObj?.name}</h3>
                <p className="text-[10px] text-sky-600 font-semibold">Online</p>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeMessages.length === 0 ? (
                <div className="bg-white text-center p-4 rounded-xl text-xs text-slate-500 max-w-xs mx-auto shadow-sm border border-slate-100">
                  This is the start of your secure conversation with {activeContactObj?.name}.
                </div>
              ) : (
                activeMessages.map(msg => {
                  // Mark as read if it's incoming and unread
                  if (msg.is_incoming && !msg.is_read) {
                    handleMarkRead(msg.id);
                  }

                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[75%] ${msg.is_incoming ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                    >
                      <div className={`px-3 py-2 rounded-2xl text-sm shadow-sm relative group ${
                        msg.is_incoming 
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm' 
                          : 'bg-[#dcf8c6] border border-[#c3e6a8] text-slate-900 rounded-tr-sm' // WhatsApp green for outgoing
                      }`}>
                        <span className="break-words">{msg.content}</span>
                        
                        <div className={`flex items-center gap-1 justify-end mt-1 ${msg.is_incoming ? 'text-slate-400' : 'text-[#6a9254]'}`}>
                          <span className="text-[9px] font-medium leading-none">
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          {!msg.is_incoming && (
                            <CheckCheck className={`w-[14px] h-[14px] ${msg.is_read ? 'text-[#34b7f1]' : 'opacity-70'}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                <div className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 shadow-sm transition-all">
                  <textarea 
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full bg-transparent outline-none text-sm resize-none max-h-32 min-h-[20px]"
                    rows={1}
                    style={{ height: 'auto' }}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={sending || !content.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md disabled:opacity-50 disabled:active:scale-100 shrink-0"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
