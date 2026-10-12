import React from 'react';
import { Clock, Building2, ExternalLink, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function DeadlinesView({ events, onEditEvent, onUpdateStatus }) {
  const today = new Date();

  // Filter & sort events with hotel deadlines
  const eventsWithDeadlines = events
    .filter(e => e.hotelStatus !== 'not_required')
    .map(e => {
      const deadlineDate = e.hotelDeadline ? new Date(e.hotelDeadline) : null;
      const daysLeft = deadlineDate ? Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)) : null;
      return { ...e, daysLeft };
    })
    .sort((a, b) => {
      // Put unbooked events with nearest deadlines first
      if (a.hotelStatus === 'booked' && b.hotelStatus !== 'booked') return 1;
      if (a.hotelStatus !== 'booked' && b.hotelStatus === 'booked') return -1;
      if (a.daysLeft === null) return 1;
      if (b.daysLeft === null) return -1;
      return a.daysLeft - b.daysLeft;
    });

  const markBooked = (eventId) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    onUpdateStatus(eventId, 'hotelStatus', 'booked');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock color="var(--accent-gold)" /> Stay & Play Hotel Block Cutoff Schedule
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Club Stay & Play rules mandate booking team rooms before the cutoff date. Keep track of room passcodes, booking deadlines, and status below.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {eventsWithDeadlines.map(evt => {
          const isUrgent = evt.daysLeft !== null && evt.daysLeft <= 30 && evt.hotelStatus !== 'booked';

          return (
            <div 
              key={evt.id}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${isUrgent ? 'var(--status-urgent-border)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: isUrgent ? '0 0 15px rgba(244, 63, 94, 0.15)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{evt.name}</h4>
                  <span className={`status-pill ${evt.hotelStatus === 'booked' ? 'booked' : isUrgent ? 'urgent' : 'pending'}`}>
                    {evt.hotelStatus === 'booked' ? '✅ Booked' : isUrgent ? '🚨 Urgent Cutoff' : '⏳ Pending'}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
                  📍 {evt.location} • {evt.displayDates}
                </div>

                <div style={{ 
                  background: 'var(--bg-input)', 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-md)', 
                  marginBottom: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cutoff Deadline:</span>
                    <strong style={{ color: isUrgent ? 'var(--status-urgent-text)' : 'var(--text-main)' }}>
                      {evt.hotelDeadline || 'Date Pending Email'}
                    </strong>
                  </div>

                  {evt.daysLeft !== null && evt.hotelStatus !== 'booked' && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: evt.daysLeft <= 14 ? 'var(--status-urgent-text)' : 'var(--accent-gold)', 
                      textAlign: 'right',
                      fontWeight: 700
                    }}>
                      {evt.daysLeft > 0 ? `${evt.daysLeft} days remaining!` : evt.daysLeft === 0 ? 'DUE TODAY!' : 'Cutoff Passed'}
                    </div>
                  )}

                  {evt.hotelBookingCode && (
                    <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Group Passcode: </span>
                      <code style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{evt.hotelBookingCode}</code>
                    </div>
                  )}
                </div>

                {evt.hotelName && (
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <strong>Booked Hotel:</strong> {evt.hotelName}
                    {evt.hotelConfirmation && <div>Conf #: <code>{evt.hotelConfirmation}</code></div>}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {evt.hotelStatus !== 'booked' && (
                  <button 
                    className="btn btn-sm btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => markBooked(evt.id)}
                  >
                    <CheckCircle2 size={14} />
                    Mark Booked
                  </button>
                )}

                {evt.hotelBookingUrl && (
                  <a 
                    href={evt.hotelBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                    title="Open Stay & Play Booking Link"
                  >
                    <ExternalLink size={14} />
                    Portal
                  </a>
                )}

                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => onEditEvent(evt)}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
