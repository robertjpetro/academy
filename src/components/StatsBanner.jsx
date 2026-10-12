import React from 'react';
import { 
  Building2, 
  Plane, 
  CalendarDays, 
  AlertCircle, 
  DollarSign, 
  CreditCard,
  Wallet
} from 'lucide-react';

export function StatsBanner({ events }) {
  const totalEvents = events.length;

  const hotelsBooked = events.filter(e => e.hotelStatus === 'booked').length;

  const flightRequiredEvents = events.filter(e => e.travelMode === 'flying');
  const flightsBooked = flightRequiredEvents.filter(e => e.flightStatus === 'booked').length;

  // Financial calculations
  const totalHotelCost = events.reduce((acc, e) => acc + (parseFloat(e.hotelCost) || 0), 0);
  const totalFlightCost = events.reduce((acc, e) => acc + (parseFloat(e.flightCost) || 0), 0);
  const totalSpent = totalHotelCost + totalFlightCost;

  const totalDepositsPaid = events.reduce((acc, e) => acc + (parseFloat(e.hotelDepositPaid) || 0), 0);
  const totalBalancesDue = events.reduce((acc, e) => acc + (parseFloat(e.hotelBalanceDue) || 0), 0);

  // Upcoming deadlines in next 45 days
  const today = new Date();
  const upcomingDeadlines = events.filter(e => {
    if (!e.hotelDeadline || e.hotelStatus === 'booked') return false;
    const deadlineDate = new Date(e.hotelDeadline);
    const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 45;
  }).length;

  const overallProgress = totalEvents > 0 
    ? Math.round(((hotelsBooked + flightsBooked) / (totalEvents + flightRequiredEvents.length)) * 100)
    : 0;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <CalendarDays size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalEvents}</div>
            <div className="stat-label">Tournaments Scheduled</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <Building2 size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{hotelsBooked} / {totalEvents}</div>
            <div className="stat-label">Hotels Booked</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
            <Plane size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{flightsBooked} / {flightRequiredEvents.length}</div>
            <div className="stat-label">Flights Booked</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <CreditCard size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#34d399' }}>${totalDepositsPaid.toLocaleString()}</div>
            <div className="stat-label">Deposits Paid Out</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
            <Wallet size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#fbbf24' }}>${totalBalancesDue.toLocaleString()}</div>
            <div className="stat-label">Remaining Hotel Balances Due</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '150px' }}>
          Season Readiness: <span style={{ color: 'var(--primary)' }}>{overallProgress}%</span>
        </div>
        <div style={{ flex: 1, height: '8px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${overallProgress}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))',
            borderRadius: '999px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>
    </div>
  );
}
