import React from 'react';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export function UrgentAlerts({ events, onEditEvent }) {
  const today = new Date();

  // Urgent = hotel deadline set & not booked, or event coming up in 60 days without hotel booked
  const urgentEvents = events.filter(e => {
    if (e.hotelStatus === 'booked' || e.hotelStatus === 'not_required') return false;

    if (e.hotelDeadline) {
      const d = new Date(e.hotelDeadline);
      const daysLeft = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
      return daysLeft <= 45;
    }

    // Also check if event itself is within 60 days
    if (e.startDate) {
      const start = new Date(e.startDate);
      const daysUntilEvent = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
      return daysUntilEvent >= 0 && daysUntilEvent <= 60;
    }

    return false;
  }).sort((a, b) => {
    const da = a.hotelDeadline ? new Date(a.hotelDeadline) : new Date(a.startDate);
    const db = b.hotelDeadline ? new Date(b.hotelDeadline) : new Date(b.startDate);
    return da - db;
  });

  if (urgentEvents.length === 0) return null;

  return (
    <div className="urgent-banner">
      <div className="urgent-content">
        <div className="urgent-icon">
          <AlertTriangle size={20} />
        </div>
        <div className="urgent-text">
          <h4>Action Needed: {urgentEvents.length} Hotel Block Deadline(s) Approaching!</h4>
          <p>
            Stay & Play hotel deadlines require team booking before cutoffs. 
            Next deadline: <strong>{urgentEvents[0].name}</strong> ({urgentEvents[0].hotelDeadline || 'Date TBD'}).
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {urgentEvents.slice(0, 2).map(evt => (
          <button 
            key={evt.id} 
            className="btn btn-sm btn-primary"
            onClick={() => onEditEvent(evt)}
          >
            Update {evt.name.split(' ')[0]}
            <ArrowRight size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}
