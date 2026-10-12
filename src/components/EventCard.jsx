import React from 'react';
import { 
  Building2, 
  Plane, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  CheckSquare, 
  Square,
  Car,
  CreditCard,
  Wallet,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getDisplayDates } from '../utils/dateUtils';

export function EventCard({ event, onEdit, onUpdateStatus, onToggleChecklist }) {
  const getCategoryBadge = (cat, reqQual) => {
    if (reqQual) {
      return <span className="badge badge-requires-qual">USAV • Requires Qualification</span>;
    }
    if (cat === 'Qualifier') {
      return <span className="badge badge-qualifier">National Qualifier</span>;
    }
    if (cat === 'National Championship') {
      return <span className="badge badge-national">National Championship</span>;
    }
    return <span className="badge badge-regular">Regular Tournament</span>;
  };

  const getHotelStatusPill = (status) => {
    switch (status) {
      case 'booked':
        return <span className="status-pill booked">✅ Hotel Booked</span>;
      case 'deadline_set':
        return <span className="status-pill urgent">🚨 Deadline Set</span>;
      case 'email_received':
        return <span className="status-pill pending">✉️ Email Received</span>;
      case 'not_required':
        return <span className="status-pill gray">Not Required</span>;
      default:
        return <span className="status-pill gray">⏳ Waiting for Email</span>;
    }
  };

  const cycleHotelStatus = (e) => {
    e.stopPropagation();
    const order = ['not_started', 'email_received', 'deadline_set', 'booked'];
    const currentIndex = order.indexOf(event.hotelStatus);
    const nextStatus = order[(currentIndex + 1) % order.length];
    
    if (nextStatus === 'booked') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    onUpdateStatus(event.id, 'hotelStatus', nextStatus);
  };

  const calculateDaysLeft = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(event.hotelDeadline);

  const depositPaid = parseFloat(event.hotelDepositPaid) || 0;
  const balanceDue = parseFloat(event.hotelBalanceDue) || 0;
  const totalCost = parseFloat(event.hotelCost) || 0;
  const displayDates = getDisplayDates(event);

  return (
    <div className="event-card">
      <div>
        <div className="event-header">
          <div className="event-title-area">
            {getCategoryBadge(event.category, event.requiresQualification)}
            <h3 style={{ marginTop: '0.4rem' }}>{event.name}</h3>
            <div className="event-dates">
              <Calendar size={14} />
              {displayDates}
            </div>
            <div className="event-location">
              <MapPin size={14} />
              {event.location} {event.venue ? `(${event.venue})` : ''}
            </div>
          </div>
          
          <button 
            className="btn btn-sm btn-outline" 
            onClick={() => onEdit(event)}
            title="Edit event travel and hotel details"
          >
            <Edit3 size={14} />
            Edit
          </button>
        </div>

        {/* Stay & Play Hotel Details Box */}
        <div className="event-details-box">
          <div className="status-row">
            <span className="status-label">
              <Building2 size={16} style={{ color: 'var(--accent-orange)' }} />
              Stay & Play Hotel:
            </span>
            <div onClick={cycleHotelStatus} title="Click to cycle status">
              {getHotelStatusPill(event.hotelStatus)}
            </div>
          </div>

          {event.hotelDeadline && (
            <div style={{ fontSize: '0.8rem', color: daysLeft !== null && daysLeft <= 14 ? 'var(--status-urgent-text)' : 'var(--text-muted)' }}>
              <strong>Deadline:</strong> {event.hotelDeadline}
              {daysLeft !== null && (
                <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
                  ({daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due Today!' : 'Expired'})
                </span>
              )}
            </div>
          )}

          {event.hotelBookingCode && (
            <div style={{ fontSize: '0.8rem', background: 'var(--bg-input)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
              <strong>Group Code:</strong> <code style={{ color: 'var(--accent-cyan)' }}>{event.hotelBookingCode}</code>
            </div>
          )}

          {event.hotelName && (
            <div style={{ fontSize: '0.85rem' }}>
              <strong>Booked Hotel:</strong> {event.hotelName}
              {event.hotelConfirmation && (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>
                  Conf #: {event.hotelConfirmation}
                </div>
              )}
            </div>
          )}

          {/* Hotel Financials / Deposit Breakdown */}
          {(depositPaid > 0 || balanceDue > 0 || totalCost > 0) && (
            <div style={{
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
              marginTop: '0.4rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CreditCard size={13} color="var(--accent-gold)" /> Deposit Paid:
                </span>
                <strong style={{ color: 'var(--accent-emerald)' }}>${depositPaid}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Wallet size={13} color="var(--status-urgent-text)" /> Balance Due at Check-in:
                </span>
                <strong style={{ color: balanceDue > 0 ? 'var(--status-pending-text)' : 'var(--accent-emerald)' }}>
                  ${balanceDue}
                </strong>
              </div>
            </div>
          )}

          {event.hotelBookingUrl && (
            <a 
              href={event.hotelBookingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-sm btn-secondary"
              style={{ justifyContent: 'center', marginTop: '0.2rem' }}
            >
              <ExternalLink size={14} />
              Open Stay & Play Portal
            </a>
          )}
        </div>

        {/* Travel & Flights Section */}
        <div className="event-details-box" style={{ marginTop: '0.75rem' }}>
          <div className="status-row">
            <span className="status-label">
              {event.travelMode === 'flying' ? <Plane size={16} style={{ color: 'var(--accent-cyan)' }} /> : <Car size={16} style={{ color: 'var(--accent-emerald)' }} />}
              Travel ({event.travelMode === 'flying' ? 'Flight' : event.travelMode === 'driving' ? 'Drive' : 'TBD'}):
            </span>
            {event.travelMode === 'flying' ? (
              <span className={`status-pill ${event.flightStatus === 'booked' ? 'booked' : 'pending'}`}>
                {event.flightStatus === 'booked' ? '✅ Flight Booked' : '✈️ Flight Needed'}
              </span>
            ) : (
              <span className="status-pill gray">🚗 Driving</span>
            )}
          </div>

          {event.travelMode === 'flying' && event.flightConfirmation && (
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
              Flight Conf: {event.flightConfirmation}
            </div>
          )}

          {event.travelNotes && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              "{event.travelNotes}"
            </div>
          )}
        </div>

        {/* Checklist preview */}
        {event.checklist && event.checklist.length > 0 && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Action Items ({event.checklist.filter(c => c.completed).length}/{event.checklist.length}):
            </div>
            {event.checklist.map(item => (
              <div 
                key={item.id} 
                onClick={() => onToggleChecklist(event.id, item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  cursor: 'pointer',
                  margin: '0.2rem 0',
                  color: item.completed ? 'var(--text-muted)' : 'var(--text-main)',
                  textDecoration: item.completed ? 'line-through' : 'none'
                }}
              >
                {item.completed ? <CheckSquare size={14} color="var(--accent-emerald)" /> : <Square size={14} />}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {event.notes && (
        <div style={{ 
          marginTop: '1rem', 
          fontSize: '0.8rem', 
          background: 'rgba(99, 102, 241, 0.1)', 
          padding: '0.5rem 0.75rem', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          gap: '0.4rem',
          alignItems: 'flex-start'
        }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
          <span>{event.notes}</span>
        </div>
      )}
    </div>
  );
}
