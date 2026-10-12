import React from 'react';
import { Calendar as CalendarIcon, MapPin, Building2, AlertCircle } from 'lucide-react';

export function CalendarView({ events, onEditEvent }) {
  const months = [
    { name: 'January 2027', year: 2027, monthIndex: 0 },
    { name: 'February 2027', year: 2027, monthIndex: 1 },
    { name: 'March 2027', year: 2027, monthIndex: 2 },
    { name: 'April 2027', year: 2027, monthIndex: 3 },
    { name: 'June 2027', year: 2027, monthIndex: 5 },
    { name: 'July 2027', year: 2027, monthIndex: 6 },
  ];

  const getEventsForMonth = (year, monthIndex) => {
    return events.filter(e => {
      if (!e.startDate) return false;
      const d = new Date(e.startDate);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
      {months.map(({ name, year, monthIndex }) => {
        const monthEvents = getEventsForMonth(year, monthIndex);
        return (
          <div 
            key={name} 
            style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '1.25rem' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <CalendarIcon size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{name}</h3>
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {monthEvents.length} Event(s)
              </span>
            </div>

            {monthEvents.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>
                No tournaments scheduled for this month.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {monthEvents.map(evt => (
                  <div 
                    key={evt.id}
                    onClick={() => onEditEvent(evt)}
                    style={{
                      background: 'var(--bg-input)',
                      borderLeft: `4px solid ${evt.hotelStatus === 'booked' ? 'var(--accent-emerald)' : 'var(--accent-gold)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{evt.name}</h4>
                      <span className={`status-pill ${evt.hotelStatus === 'booked' ? 'booked' : 'pending'}`}>
                        {evt.hotelStatus === 'booked' ? 'Hotel Booked' : 'Pending Hotel'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                      📅 {evt.displayDates}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      📍 {evt.location}
                    </div>

                    {evt.hotelDeadline && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', marginTop: '0.4rem' }}>
                        ⏰ Hotel Cutoff: {evt.hotelDeadline}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
