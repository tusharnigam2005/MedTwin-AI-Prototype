import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AppointmentsList() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.get(`${baseUrl}/api/appointments/my`);
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.get(`${baseUrl}/api/doctor/all`);
      setDoctors(res.data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    if (user?.role === 'patient') {
      fetchDoctors();
    }
  }, [user]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) return alert("Please fill all fields");
    setBookingLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      await axios.post(`${baseUrl}/api/appointments/book`, {
        doctor_id: parseInt(selectedDoctor),
        date: date,
        time: time,
        reason: reason
      });
      setShowBookingForm(false);
      setReason('');
      setDate('');
      setTime('');
      fetchAppointments();
      alert("Appointment booked successfully!");
    } catch (err) {
      alert("Failed to book appointment: " + (err.response?.data?.detail || err.message));
    } finally {
      setBookingLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      await axios.put(`${baseUrl}/api/appointments/update/${id}`, { status });
      fetchAppointments();
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <h3 className="text-slate-900 font-bold text-lg">Appointments</h3>
        {user?.role === 'patient' && (
          <button 
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {showBookingForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Book New</>}
          </button>
        )}
      </div>

      {showBookingForm && user?.role === 'patient' && (
        <form onSubmit={handleBookAppointment} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 mb-6">
          <h4 className="font-bold text-slate-800 text-sm">Book an Appointment</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Doctor</label>
              <select 
                value={selectedDoctor} 
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">-- Select --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Time</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reason (Optional)</label>
              <input 
                type="text" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief reason for visit"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={bookingLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold w-full transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Booking'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {appointments.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No appointments found.</p>
        ) : (
          appointments.map(appt => (
            <div key={appt.id} className="p-4 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white hover:border-sky-200 transition-colors gap-3">
              <div>
                <p className="font-bold text-slate-900">
                  {user?.role === 'patient' ? appt.doctor_name : appt.patient_name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{appt.reason || "General Checkup"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    appt.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    appt.status === 'rescheduled' ? 'bg-amber-100 text-amber-700' :
                    appt.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {appt.status}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right flex flex-col gap-1">
                <p className="font-bold text-sky-600 flex items-center sm:justify-end gap-1 text-sm">
                  <Calendar className="w-4 h-4" /> {appt.date}
                </p>
                <p className="text-xs text-slate-500 flex items-center sm:justify-end gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {appt.time}
                </p>
              </div>
              
              {user?.role === 'doctor' && appt.status === 'pending' && (
                <div className="flex gap-2 sm:ml-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                  <button 
                    onClick={() => handleUpdateStatus(appt.id, 'approved')}
                    className="flex-1 sm:flex-none text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                    className="flex-1 sm:flex-none text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
